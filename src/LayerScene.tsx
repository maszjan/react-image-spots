import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { resolveLayerAnimation } from "./components/layerAnimations";
import { LayerPanel } from "./components/LayerPanel";
import { LayerToolbar } from "./components/LayerToolbar";
import type { AnchorRect } from "./components/useDraggable";
import { searchIcons, splitIconWords, useLucideIcon } from "./iconRegistry";
import {
	getEffectiveLayerValues,
	updateLayerAtBreakpoint,
} from "./layerResolve";
import { useSpotsEditContext } from "./SpotsEditProvider";
import type {
	IconLayerDef,
	LayerBreakpoint,
	LayerDef,
	LayerSceneHandle,
	LayerSceneProps,
} from "./types";
import {
	DEFAULT_BREAKPOINTS,
	resolveBreakpointFromWidth,
} from "./layerBreakpoint";

const FONT = "system-ui,sans-serif";
const ACCENT = "#3b82f6";

// The toolbar/panel are portalled, `position: fixed` overlays (see
// `wrapperRect`) that never share layout space with the scene box - so their
// own presence/size can never push, shrink, or reflow it, or anything on the
// page around it. The readout is a normal absolutely-positioned overlay
// within the scene's own (edit-mode-independent-sized) wrapper.
const READOUT_HEIGHT = 34;

// Simulated device widths (px) for the toolbar's Mobile/Tablet buttons - the
// scene box itself visually narrows to this width (centered) so switching
// modes actually previews the layout at that size, not just recalculating
// `responsive` overrides inside an unchanged full-width box. Desktop has no
// entry - it means "no constraint, fill the available width".
const DEVICE_PREVIEW_WIDTH: Partial<Record<LayerBreakpoint, number>> = {
	mobile: 375,
	tablet: 768,
};

const sceneCSS = `
@keyframes ris-layer-toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(6px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}`;

type DragKind = "move" | "resize" | "rotate";

interface DragState {
	kind: DragKind;
	layerId: string;
	startClientX: number;
	startClientY: number;
	startPosition: { x: number; y: number };
	startWidth: number;
	startHeight: number;
	startRotate: number;
	centerClientX: number;
	centerClientY: number;
}

interface Readout {
	x: number;
	y: number;
	width: number;
	height: number;
	rotate: number;
}

function nextZIndex(layers: LayerDef[]): number {
	return Math.max(0, ...layers.map((l) => l.zIndex ?? 0)) + 1;
}

function prevZIndex(layers: LayerDef[]): number {
	return Math.min(0, ...layers.map((l) => l.zIndex ?? 0)) - 1;
}

function makeId(): string {
	return `layer-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const IconGlyph: React.FC<{
	iconName: string;
	size: number;
	color?: string;
}> = ({ iconName, size, color }) => {
	const Icon = useLucideIcon(iconName);
	if (Icon) {
		return <Icon size={size} color={color} />;
	}
	return (
		<div
			title={`Icon "${iconName}" unavailable - install lucide-react`}
			style={{
				width: size,
				height: size,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: 6,
				border: "1.5px dashed #94a3b8",
				color: "#94a3b8",
				fontSize: Math.max(10, size * 0.35),
				fontFamily: FONT,
				fontWeight: 700,
				background: "rgba(148,163,184,0.08)",
			}}>
			?
		</div>
	);
};

const LayerContent: React.FC<{
	layer: LayerDef;
	width: number;
	height: number;
}> = ({ layer, width, height }) => {
	if (layer.type === "image") {
		return (
			<img
				src={layer.src}
				alt={layer.alt ?? ""}
				draggable={false}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "contain",
					display: "block",
					userSelect: "none",
					pointerEvents: "none",
					filter: layer.dropShadow
						? `drop-shadow(${layer.dropShadow})`
						: undefined,
				}}
			/>
		);
	}
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				pointerEvents: "none",
			}}>
			<IconGlyph
				iconName={layer.iconName}
				size={Math.min(width, height)}
				color={layer.color}
			/>
		</div>
	);
};

interface IconBrowserProps {
	onPick: (iconName: string) => void;
	onClose: () => void;
}

const IconBrowser: React.FC<IconBrowserProps> = ({ onPick, onClose }) => {
	const [query, setQuery] = useState("");
	const [debounced, setDebounced] = useState("");

	useEffect(() => {
		const t = setTimeout(() => setDebounced(query), 150);
		return () => clearTimeout(t);
	}, [query]);

	const results = useMemo(
		() => searchIcons(debounced).slice(0, 90),
		[debounced],
	);

	return (
		<div
			style={{
				// Fixed to the viewport, not the (possibly page-spanning) scene
				// box - so it always centers on what's actually visible on
				// screen, not the middle of a very tall container.
				position: "fixed",
				inset: 0,
				zIndex: 2147483000,
				background: "rgba(15,23,42,0.45)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: FONT,
			}}
			onPointerDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div
				style={{
					width: "min(520px, 90%)",
					maxHeight: "70%",
					display: "flex",
					flexDirection: "column",
					background: "white",
					borderRadius: 12,
					boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
					overflow: "hidden",
				}}>
				<div
					style={{
						padding: "12px 14px",
						borderBottom: "1px solid #e2e8f0",
						display: "flex",
						gap: 8,
					}}>
					<input
						autoFocus
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search icons… (e.g. "shopping bag")'
						style={{
							flex: 1,
							padding: "8px 10px",
							borderRadius: 8,
							border: "1.5px solid #e2e8f0",
							fontSize: 13,
							fontFamily: FONT,
							outline: "none",
						}}
					/>
					<button
						onClick={onClose}
						style={{
							border: "none",
							background: "#f1f5f9",
							borderRadius: 8,
							padding: "0 12px",
							cursor: "pointer",
							fontSize: 13,
							fontWeight: 600,
							color: "#475569",
						}}>
						Close
					</button>
				</div>
				<div
					style={{
						overflow: "auto",
						padding: 12,
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
						gap: 8,
					}}>
					{results.map((name) => (
						<button
							key={name}
							onClick={() => onPick(name)}
							title={splitIconWords(name).join(" ")}
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: 4,
								padding: "10px 4px",
								borderRadius: 8,
								border: "1.5px solid #e2e8f0",
								background: "white",
								cursor: "pointer",
								color: "#334155",
							}}>
							<IconGlyph iconName={name} size={20} />
							<span
								style={{
									fontSize: 9,
									lineHeight: 1.2,
									textAlign: "center",
									wordBreak: "break-word",
								}}>
								{name}
							</span>
						</button>
					))}
					{results.length === 0 && (
						<div
							style={{
								gridColumn: "1/-1",
								color: "#94a3b8",
								fontSize: 12,
								textAlign: "center",
								padding: 20,
							}}>
							No icons match "{debounced}"
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export const LayerScene = forwardRef<LayerSceneHandle, LayerSceneProps>(
	function LayerScene(
		{
			layers: initialLayers,
			mode,
			onChange,
			onExport,
			autoExportOnChange = false,
			breakpoints = DEFAULT_BREAKPOINTS,
			showChrome = true,
			onSelectedLayerChange,
			className = "",
			style,
		},
		ref,
	) {
		const contextEditMode = useSpotsEditContext();
		const resolvedMode = mode ?? (contextEditMode ? "edit" : "preview");
		const isEdit = resolvedMode === "edit";
		const showEditorChrome = isEdit && showChrome;

		const [layers, setLayers] = useState<LayerDef[]>(initialLayers);
		const [selectedId, setSelectedId] = useState<string | null>(null);
		const [readout, setReadout] = useState<Readout | null>(null);
		const [iconBrowserOpen, setIconBrowserOpen] = useState(false);
		const [panelOpen, setPanelOpen] = useState(true);
		const [toast, setToast] = useState<string | null>(null);

		const containerRef = useRef<HTMLDivElement>(null);
		// The scene's own outer wrapper - the toolbar/panel anchor to *this*
		// element's rect (not `containerRef`, the inner clipped scene box),
		// matching where they used to render as normal DOM children of it
		// before being portalled out to `document.body`.
		const wrapperRef = useRef<HTMLDivElement>(null);
		const [wrapperRect, setWrapperRect] = useState<AnchorRect | null>(null);
		const layerElRefs = useRef<Record<string, HTMLDivElement | null>>({});
		const dragRef = useRef<DragState | null>(null);
		const autoExportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
		const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
		const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
		// A toolbar-driven override for previewing a specific device breakpoint
		// regardless of the scene box's actual rendered width - null means
		// "auto", resolved from measured width below.
		const [forcedBreakpoint, setForcedBreakpoint] =
			useState<LayerBreakpoint | null>(null);

		// Resolved from this LayerScene's own rendered width - not the browser
		// window's - so it reacts correctly to any ancestor that constrains
		// width, including SpotsEditProvider's whole-page device-preview frame.
		// A forced breakpoint from the toolbar's Mobile/Tablet/Desktop switcher
		// takes priority over the measured value.
		const activeBreakpoint =
			forcedBreakpoint ??
			resolveBreakpointFromWidth(containerSize.width, breakpoints);

		// Measure before paint so there's no visible jump on first render.
		useLayoutEffect(() => {
			const el = containerRef.current;
			if (!el) return;
			const update = () => {
				const rect = el.getBoundingClientRect();
				setContainerSize({ width: rect.width, height: rect.height });
			};
			update();
			const observer = new ResizeObserver(update);
			observer.observe(el);
			return () => observer.disconnect();
		}, []);

		// Tracks the outer wrapper's viewport rect so the portalled-to-body
		// toolbar/panel (see LayerToolbar/LayerPanel's `anchorRect` prop) can
		// still visually anchor themselves near this LayerScene instance -
		// listens on scroll (capture, to catch any scrollable ancestor, not
		// just the window) and resize so they keep tracking it as the page
		// moves, not just once on mount.
		useLayoutEffect(() => {
			if (!showEditorChrome) return;
			const el = wrapperRef.current;
			if (!el) return;
			const update = () => {
				const rect = el.getBoundingClientRect();
				setWrapperRect({
					top: rect.top,
					left: rect.left,
					right: rect.right,
					bottom: rect.bottom,
				});
			};
			update();
			const observer = new ResizeObserver(update);
			observer.observe(el);
			window.addEventListener("scroll", update, true);
			window.addEventListener("resize", update);
			return () => {
				observer.disconnect();
				window.removeEventListener("scroll", update, true);
				window.removeEventListener("resize", update);
			};
		}, [showEditorChrome]);

		// Live readout for the selected layer, recomputed from its actual DOM
		// rect (not a separately-tracked value) whenever selection, breakpoint,
		// layer data, or container size changes - not just while dragging.
		useLayoutEffect(() => {
			if (!isEdit || !selectedId) {
				setReadout(null);
				return;
			}
			const container = containerRef.current;
			const el = layerElRefs.current[selectedId];
			if (!container || !el) return;
			const containerRect = container.getBoundingClientRect();
			const rect = el.getBoundingClientRect();
			const layer = layers.find((l) => l.id === selectedId);
			const rotate = layer
				? getEffectiveLayerValues(layer, activeBreakpoint).rotate
				: 0;
			setReadout({
				x: parseFloat(
					(
						((rect.left + rect.width / 2 - containerRect.left) /
							containerRect.width) *
						100
					).toFixed(2),
				),
				y: parseFloat(
					(
						((rect.top + rect.height / 2 - containerRect.top) /
							containerRect.height) *
						100
					).toFixed(2),
				),
				width: Math.round(rect.width),
				height: Math.round(rect.height),
				rotate,
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [selectedId, activeBreakpoint, layers, isEdit, containerSize]);

		const showToast = useCallback((msg: string) => {
			setToast(msg);
			if (toastTimer.current) clearTimeout(toastTimer.current);
			toastTimer.current = setTimeout(() => setToast(null), 1800);
		}, []);

		const commitLayers = useCallback(
			(next: LayerDef[]) => {
				setLayers(next);
				onChange?.(next);
				if (autoExportOnChange) {
					if (autoExportTimer.current) clearTimeout(autoExportTimer.current);
					autoExportTimer.current = setTimeout(() => {
						onExport?.(next);
					}, 500);
				}
			},
			[onChange, onExport, autoExportOnChange],
		);

		const handleExportClick = useCallback(() => {
			const json = JSON.stringify(layers, null, 2);
			onExport?.(layers);
			navigator.clipboard
				.writeText(json)
				.then(() => showToast("Layers copied to clipboard"))
				.catch(() => showToast("Export ready (clipboard unavailable)"));
		}, [layers, onExport, showToast]);

		const selectedLayer = layers.find((l) => l.id === selectedId) ?? null;

		const updateSelected = useCallback(
			(patch: Parameters<typeof updateLayerAtBreakpoint>[2]) => {
				if (!selectedId) return;
				setLayers((prev) => {
					const next = prev.map((l) =>
						l.id === selectedId
							? updateLayerAtBreakpoint(l, activeBreakpoint, patch)
							: l,
					);
					return next;
				});
			},
			[selectedId, activeBreakpoint],
		);

		// Drag handlers are attached to `window` once (at pointerdown) and keep
		// closing over the render that was active at that moment, so they can't
		// read a fresh `layers` value from the render closure - this ref always
		// holds the latest value for them to read instead.
		const layersRef = useRef(layers);
		layersRef.current = layers;

		const commitSelected = useCallback(() => {
			commitLayers(layersRef.current);
		}, [commitLayers]);

		const bringToFront = useCallback(
			(id: string) => {
				const next = layers.map((l) =>
					l.id === id ? { ...l, zIndex: nextZIndex(layers) } : l,
				);
				commitLayers(next);
			},
			[layers, commitLayers],
		);

		const sendToBack = useCallback(
			(id: string) => {
				const next = layers.map((l) =>
					l.id === id ? { ...l, zIndex: prevZIndex(layers) } : l,
				);
				commitLayers(next);
			},
			[layers, commitLayers],
		);

		const deleteLayer = useCallback(
			(id: string) => {
				const next = layers.filter((l) => l.id !== id);
				commitLayers(next);
				setSelectedId((cur) => (cur === id ? null : cur));
			},
			[layers, commitLayers],
		);

		const duplicateLayer = useCallback(
			(id: string) => {
				const source = layers.find((l) => l.id === id);
				if (!source) return;
				const copy: LayerDef = {
					...source,
					id: makeId(),
					position: { x: source.position.x + 4, y: source.position.y + 4 },
					zIndex: nextZIndex(layers),
				};
				commitLayers([...layers, copy]);
				setSelectedId(copy.id);
			},
			[layers, commitLayers],
		);

		const addIconLayer = useCallback(
			(iconName: string) => {
				// Match the visual scale of whatever's already in the scene instead
				// of a fixed default - a hardcoded size could render several times
				// larger than everything else already there.
				const existingIconSizes = layers
					.filter((l): l is IconLayerDef => l.type === "icon")
					.map((l) => l.size);
				const existingImageMinDims = layers
					.filter((l) => l.type === "image")
					.map((l) => Math.min(l.width, l.height));
				const size =
					existingIconSizes.length > 0
						? Math.round(
								existingIconSizes.reduce((a, b) => a + b, 0) /
									existingIconSizes.length,
							)
						: existingImageMinDims.length > 0
							? Math.round(
									(existingImageMinDims.reduce((a, b) => a + b, 0) /
										existingImageMinDims.length) *
										0.18,
								)
							: 40;
				const existingIconColor = layers.find(
					(l): l is IconLayerDef => l.type === "icon",
				)?.color;

				const layer: IconLayerDef = {
					id: makeId(),
					type: "icon",
					iconName,
					position: { x: 50, y: 50 },
					size: Math.max(16, size),
					rotate: 0,
					color: existingIconColor ?? "#64748b",
					zIndex: nextZIndex(layers),
					animation: "float",
				};
				const next = [...layers, layer];
				commitLayers(next);
				setSelectedId(layer.id);
				setIconBrowserOpen(false);
			},
			[layers, commitLayers],
		);

		const updateLayerField = useCallback(
			(id: string, patch: Partial<LayerDef>) => {
				const next = layers.map((l) =>
					l.id === id ? ({ ...l, ...patch } as LayerDef) : l,
				);
				commitLayers(next);
			},
			[layers, commitLayers],
		);

		const nudgeSelected = useCallback(
			(dx: number, dy: number) => {
				if (!selectedId) return;
				const layer = layers.find((l) => l.id === selectedId);
				if (!layer) return;
				const values = getEffectiveLayerValues(layer, activeBreakpoint);
				const nextX = Math.min(100, Math.max(0, values.position.x + dx));
				const nextY = Math.min(100, Math.max(0, values.position.y + dy));
				const next = layers.map((l) =>
					l.id === selectedId
						? updateLayerAtBreakpoint(l, activeBreakpoint, {
								position: { x: nextX, y: nextY },
							})
						: l,
				);
				commitLayers(next);
			},
			[selectedId, layers, activeBreakpoint, commitLayers],
		);

		// Arrow keys nudge the selected layer's position - 1% per press, 5% with
		// Shift. Skipped while focus is in a text input (e.g. the icon search box)
		// so typing isn't hijacked.
		useEffect(() => {
			if (!isEdit || !selectedId) return;
			const DELTAS: Record<string, [number, number]> = {
				ArrowUp: [0, -1],
				ArrowDown: [0, 1],
				ArrowLeft: [-1, 0],
				ArrowRight: [1, 0],
			};
			const handler = (e: KeyboardEvent) => {
				const delta = DELTAS[e.key];
				if (!delta) return;
				const target = e.target as HTMLElement | null;
				if (
					target &&
					(target.tagName === "INPUT" || target.tagName === "TEXTAREA")
				) {
					return;
				}
				e.preventDefault();
				const step = e.shiftKey ? 5 : 1;
				nudgeSelected(delta[0] * step, delta[1] * step);
			};
			window.addEventListener("keydown", handler);
			return () => window.removeEventListener("keydown", handler);
		}, [isEdit, selectedId, nudgeSelected]);

		useEffect(() => {
			onSelectedLayerChange?.(selectedLayer);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [selectedLayer]);

		useImperativeHandle(
			ref,
			() => ({
				bringToFront,
				sendToBack,
				duplicateLayer,
				deleteLayer,
				updateLayerField,
				selectLayer: (id: string | null) => setSelectedId(id),
				openIconBrowser: () => setIconBrowserOpen(true),
				exportLayers: handleExportClick,
			}),
			[
				bringToFront,
				sendToBack,
				duplicateLayer,
				deleteLayer,
				updateLayerField,
				handleExportClick,
			],
		);

		// --- Drag / resize / rotate ---

		const handlePointerMove = useCallback(
			(e: PointerEvent) => {
				const drag = dragRef.current;
				const container = containerRef.current;
				if (!drag || !container) return;

				const containerRect = container.getBoundingClientRect();
				const dxPx = e.clientX - drag.startClientX;
				const dyPx = e.clientY - drag.startClientY;

				if (drag.kind === "move") {
					const dxPct = (dxPx / containerRect.width) * 100;
					const dyPct = (dyPx / containerRect.height) * 100;
					const nextX = Math.min(
						100,
						Math.max(0, drag.startPosition.x + dxPct),
					);
					const nextY = Math.min(
						100,
						Math.max(0, drag.startPosition.y + dyPct),
					);
					updateSelected({ position: { x: nextX, y: nextY } });
				} else if (drag.kind === "resize") {
					const layer = layers.find((l) => l.id === drag.layerId);
					if (layer?.type === "image") {
						// Aspect-ratio-locked: width drives the resize, height follows.
						const aspect = drag.startWidth / drag.startHeight;
						const nextWidth = Math.max(8, drag.startWidth + dxPx);
						const nextHeight = Math.max(8, nextWidth / aspect);
						updateSelected({ width: nextWidth, height: nextHeight });
					} else {
						// Icon layers are square (a single `size`), so this is already
						// a uniform resize.
						updateSelected({
							size: Math.max(8, drag.startWidth + Math.max(dxPx, dyPx)),
						});
					}
				} else if (drag.kind === "rotate") {
					const angle =
						(Math.atan2(
							e.clientY - drag.centerClientY,
							e.clientX - drag.centerClientX,
						) *
							180) /
							Math.PI +
						90;
					updateSelected({ rotate: Math.round(angle) });
				}

				// The readout for this frame is derived from the actual DOM rect by
				// the useLayoutEffect below, which reruns whenever `layers` changes.
			},
			[updateSelected, layers],
		);

		const handlePointerUp = useCallback(() => {
			dragRef.current = null;
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
			commitSelected();
		}, [handlePointerMove, commitSelected]);

		const beginDrag = useCallback(
			(kind: DragKind, layer: LayerDef, e: React.PointerEvent) => {
				e.stopPropagation();
				setSelectedId(layer.id);
				const values = getEffectiveLayerValues(layer, activeBreakpoint);
				const el = layerElRefs.current[layer.id];
				const rect = el?.getBoundingClientRect();
				dragRef.current = {
					kind,
					layerId: layer.id,
					startClientX: e.clientX,
					startClientY: e.clientY,
					startPosition: values.position,
					startWidth: values.width ?? values.size ?? 40,
					startHeight: values.height ?? values.size ?? 40,
					startRotate: values.rotate,
					centerClientX: rect ? rect.left + rect.width / 2 : e.clientX,
					centerClientY: rect ? rect.top + rect.height / 2 : e.clientY,
				};
				window.addEventListener("pointermove", handlePointerMove);
				window.addEventListener("pointerup", handlePointerUp);
			},
			[activeBreakpoint, handlePointerMove, handlePointerUp],
		);

		const sortedLayers = useMemo(
			() => [...layers].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
			[layers],
		);

		// Only a toolbar-forced Mobile/Tablet selection narrows the box - the
		// auto-resolved breakpoint (from measured width) must never feed back
		// into the width it was measured from.
		const devicePreviewWidth =
			showEditorChrome && forcedBreakpoint
				? DEVICE_PREVIEW_WIDTH[forcedBreakpoint]
				: undefined;

		return (
			<div
				ref={wrapperRef}
				className={className}
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					fontFamily: FONT,
					...style,
				}}>
				<style>{sceneCSS}</style>

				{/* Toolbar - shared component (also used by SpotsEditProvider's
			    backgroundLayers), portalled to document.body and positioned
			    `fixed` (anchored near this wrapper's own rect) so no ancestor
			    container - however small or clipped - can ever constrain or
			    clip it. */}
				{showEditorChrome && (
					<LayerToolbar
						selected={selectedLayer}
						layerCount={layers.length}
						panelOpen={panelOpen}
						onTogglePanel={() => setPanelOpen((o) => !o)}
						onAdd={() => setIconBrowserOpen(true)}
						onBringToFront={bringToFront}
						onSendToBack={sendToBack}
						onDuplicate={duplicateLayer}
						onDelete={deleteLayer}
						onExport={handleExportClick}
						onAnimationChange={(id, animation) =>
							updateLayerField(id, { animation })
						}
						onOpacityChange={(id, opacity) => updateLayerField(id, { opacity })}
						onColorChange={(id, color) => updateLayerField(id, { color })}
						// The Desktop button represents "no simulation" (forced =
						// null), which highlights as Desktop regardless of what the
						// real measured width currently auto-resolves to - e.g. a
						// scene box that happens to be tablet-width shouldn't leave
						// Desktop looking unselected right after clicking it. Layout
						// itself still uses the real auto-resolved value below
						// (`activeBreakpoint`), only the toolbar's highlighted button
						// is decoupled from it.
						breakpoint={forcedBreakpoint ?? "desktop"}
						onBreakpointChange={(bp) =>
							// "Desktop" means "stop simulating, go back to the real
							// measured width" (like a device toolbar's "Responsive"
							// option) - not "always force desktop regardless of the
							// actual browser size" - otherwise resizing the browser
							// after clicking any button would stop doing anything.
							setForcedBreakpoint(bp === "desktop" ? null : bp)
						}
						defaultCorner={{ top: 0, left: 0 }}
						anchorRect={wrapperRect}
					/>
				)}

				{/* The scene box - ONLY the composed layers render here, exactly
			    what an end user would see in preview. The only exception is
			    the selected layer's own selection outline and resize/rotate
			    handles, which are visual indicators of that layer's position,
			    not general editor chrome. The toolbar/panel/readout are now
			    all portalled, `position: fixed` overlays anchored to this
			    wrapper's rect (see `wrapperRect`) rather than sharing layout
			    space with this box - so its own top/left/right/bottom must
			    NEVER depend on edit mode. `boxSizing: border-box` keeps the
			    rendered box (as measured by `getBoundingClientRect()`)
			    pixel-identical whether or not the edit-mode border below is
			    drawn - a `content-box` border would otherwise grow the box by
			    its own width and shift measurements between modes. */}
				<div
					ref={containerRef}
					style={{
						position: "absolute",
						top: 0,
						bottom: 0,
						...(devicePreviewWidth
							? {
									left: "50%",
									width: devicePreviewWidth,
									maxWidth: "calc(100% - 8px)",
									transform: "translateX(-50%)",
								}
							: { left: 0, right: 0 }),
						boxSizing: "border-box",
						// `position: absolute` still works as a containing block for
						// this scene's own absolutely-positioned layer children below.
						zIndex: 0,
						// A layer's fixed-px size can exceed a squeezed scene box at
						// narrow viewports - clip rather than let it bleed into the
						// toolbar/panel next to it.
						overflow: "hidden",
						borderRadius: showEditorChrome ? 10 : "inherit",
						// A visible boundary while editing, so the scene box reads as
						// its own self-contained region next to the toolbar/panel
						// regardless of the page's own background (this would be an
						// unwanted visual artifact in preview/production, so it's
						// edit-mode only). `border-box` above means this never changes
						// the box's rendered position/size, only what's drawn inside it.
						border: showEditorChrome
							? "1px solid rgba(148,163,184,0.25)"
							: "1px solid transparent",
						background: showEditorChrome ? "rgba(148,163,184,0.06)" : undefined,
						// When stacked with other LayerScene instances in the same
						// viewport (e.g. SpotsEditProvider's page-wide background
						// canvas, showChrome=false), empty space must stay
						// click-through so it doesn't steal clicks meant for
						// whatever's underneath - only individual layer elements
						// opt back into pointer-events.
						pointerEvents: showChrome ? undefined : "none",
					}}
					onPointerDown={() => {
						if (isEdit) setSelectedId(null);
					}}>
					{sortedLayers.map((layer) => {
						const values = getEffectiveLayerValues(layer, activeBreakpoint);
						const resolvedAnim = resolveLayerAnimation(layer.animation);
						const isSelected = isEdit && selectedId === layer.id;
						const width = values.width ?? values.size ?? 40;
						const height = values.height ?? values.size ?? 40;

						return (
							<div
								key={layer.id}
								ref={(el) => {
									layerElRefs.current[layer.id] = el;
								}}
								onPointerDown={
									isEdit ? (e) => beginDrag("move", layer, e) : undefined
								}
								style={{
									position: "absolute",
									left: `${values.position.x}%`,
									top: `${values.position.y}%`,
									width,
									height,
									transform: `translate(-50%, -50%) rotate(${values.rotate}deg)`,
									zIndex: layer.zIndex ?? 0,
									opacity: layer.opacity ?? 1,
									cursor: isEdit ? "move" : "default",
									outline: isSelected ? `2px solid ${ACCENT}` : "none",
									outlineOffset: 2,
									touchAction: "none",
									// Purely decorative in preview (click-through); a
									// layer only becomes a hit target while editing,
									// regardless of the container's own pointer-events.
									pointerEvents: isEdit ? "auto" : "none",
								}}>
								{resolvedAnim.css && <style>{resolvedAnim.css}</style>}
								<div
									style={{
										width: "100%",
										height: "100%",
										animation: resolvedAnim.animation || undefined,
									}}>
									<LayerContent layer={layer} width={width} height={height} />
								</div>

								{isSelected && (
									<>
										<div
											onPointerDown={(e) => beginDrag("rotate", layer, e)}
											title='Rotate'
											style={{
												position: "absolute",
												top: -18,
												left: "50%",
												transform: "translateX(-50%)",
												width: 10,
												height: 10,
												borderRadius: "50%",
												background: ACCENT,
												border: "2px solid white",
												boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
												cursor: "grab",
											}}
										/>

										<div
											onPointerDown={(e) => beginDrag("resize", layer, e)}
											title='Resize'
											style={{
												position: "absolute",
												right: -6,
												bottom: -6,
												width: 12,
												height: 12,
												background: ACCENT,
												border: "2px solid white",
												borderRadius: 3,
												boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
												cursor: "nwse-resize",
											}}
										/>
									</>
								)}
							</div>
						);
					})}
				</div>

				{/* Layer panel - shared component (also used by SpotsEditProvider's
			    backgroundLayers), floating and draggable, never an overlay
			    inside the scene box, so two instances on the same page can
			    never visually collide. */}
				{showEditorChrome && panelOpen && (
					<LayerPanel
						title='Layers'
						layers={layers}
						selectedId={selectedId}
						onSelect={(id) => setSelectedId(id)}
						defaultCorner={{ top: 0, right: 0 }}
						anchorRect={wrapperRect}
					/>
				)}

				{/* Live readout - below the scene box, outside it. Absolutely
			    positioned at a fixed offset (its own reserved band, see
			    READOUT_HEIGHT) so appearing/disappearing on selection never
			    affects the scene box's size. */}
				{isEdit && showChrome && selectedLayer && readout && (
					<div
						style={{
							position: "absolute",
							bottom: 0,
							left: 0,
							height: READOUT_HEIGHT,
							background: "#0f172a",
							color: "white",
							borderRadius: 8,
							padding: "6px 12px",
							fontSize: 11,
							fontFamily: "ui-monospace,monospace",
							display: "flex",
							alignItems: "center",
							gap: 10,
							boxSizing: "border-box",
						}}>
						<span>x: {readout.x.toFixed(1)}%</span>
						<span>y: {readout.y.toFixed(1)}%</span>
						<span>w: {readout.width}px</span>
						<span>h: {readout.height}px</span>
						<span>rotate: {readout.rotate}°</span>
					</div>
				)}

				{iconBrowserOpen && (
					<IconBrowser
						onPick={addIconLayer}
						onClose={() => setIconBrowserOpen(false)}
					/>
				)}

				{toast && (
					<div
						style={{
							position: "absolute",
							bottom: 8,
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: 150,
							background: "#0f172a",
							color: "white",
							padding: "8px 16px",
							borderRadius: 8,
							fontSize: 12,
							fontWeight: 600,
							whiteSpace: "nowrap",
							pointerEvents: "none",
							boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
							animation: "ris-layer-toast-in 0.2s ease",
						}}>
						✓ {toast}
					</div>
				)}
			</div>
		);
	},
);
