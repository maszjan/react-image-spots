import React from "react";
import { createPortal } from "react-dom";
import { useLucideIcon } from "../iconRegistry";
import { useDraggable, type AnchorRect } from "./useDraggable";
import {
	PRESET_DEFAULT_INTENSITY,
	PRESET_DURATION_SECONDS,
} from "./layerAnimations";
import type {
	IconLayerDef,
	LayerAnimation,
	LayerAnimationPreset,
	LayerBreakpoint,
	LayerDef,
} from "../types";

const FONT = "system-ui,sans-serif";
const ACCENT = "#3b82f6";

const ANIMATION_OPTIONS: {
	value: LayerAnimationPreset;
	label: string;
	glyph: string;
}[] = [
	{ value: "none", label: "None", glyph: "-" },
	{ value: "float", label: "Float", glyph: "↕" },
	{ value: "pulse", label: "Pulse", glyph: "◐" },
	{ value: "spin", label: "Spin", glyph: "↻" },
	{ value: "sway", label: "Sway", glyph: "↔" },
];

const PRESET_COLORS = [
	"#3b82f6",
	"#ef4444",
	"#f59e0b",
	"#10b981",
	"#8b5cf6",
	"#ec4899",
	"#64748b",
	"#0f172a",
];

const BREAKPOINTS: LayerBreakpoint[] = ["mobile", "tablet", "desktop"];

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<span
		style={{
			fontSize: 10,
			fontWeight: 700,
			color: "#94a3b8",
			textTransform: "uppercase",
			letterSpacing: "0.03em",
			lineHeight: 1,
			whiteSpace: "nowrap",
		}}>
		{children}
	</span>
);

/**
 * A visually-separated cluster of related controls (e.g. "Front/back/dup/del",
 * "Animation"). Rendered as its own rounded card with `flexShrink: 0` and
 * `whiteSpace: nowrap` internals so when the toolbar wraps at narrow widths,
 * whole groups move to the next line together instead of splitting a control
 * in half mid-row.
 */
const Group: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			gap: 6,
			flexShrink: 0,
			background: "#f8fafc",
			border: "1px solid #eef2f7",
			borderRadius: 8,
			padding: "5px 8px",
		}}>
		{children}
	</div>
);

/**
 * Same visual card as `Group`, but with its own heading label above the
 * controls - used for icon-only button clusters so every group in the
 * toolbar (icon rows and labeled-control rows alike) shares one consistent
 * "label on top, controls below" layout instead of two different styles.
 */
const LabeledGroup: React.FC<{ label: string; children: React.ReactNode }> = ({
	label,
	children,
}) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: 3,
			flexShrink: 0,
			background: "#f8fafc",
			border: "1px solid #eef2f7",
			borderRadius: 8,
			padding: "5px 8px",
		}}>
		<FieldLabel>{label}</FieldLabel>
		<div style={{ display: "flex", alignItems: "center", gap: 4 }}>
			{children}
		</div>
	</div>
);

const isValidHex = (v: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);

/**
 * Popover anchored to an arbitrary screen position (computed by the caller
 * from the trigger button's `getBoundingClientRect()`), rendered via a portal
 * to `document.body` so it's never clipped by the toolbar's own bounds and
 * never goes stale when the toolbar itself is dragged elsewhere.
 */
const ColorPopover: React.FC<{
	anchorRect: DOMRect;
	color: string;
	onChange: (color: string) => void;
	onClose: () => void;
}> = ({ anchorRect, color, onChange, onClose }) => {
	const [hexInput, setHexInput] = React.useState(color);
	const popoverRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		setHexInput(color);
	}, [color]);

	React.useEffect(() => {
		const onPointerDown = (e: PointerEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onClose]);

	const POPOVER_HEIGHT = 172;
	const POPOVER_WIDTH = 192;
	const openUpward =
		anchorRect.bottom + 8 + POPOVER_HEIGHT > window.innerHeight;

	return createPortal(
		<div
			ref={popoverRef}
			onPointerDown={(e) => e.stopPropagation()}
			style={{
				position: "fixed",
				left: Math.min(anchorRect.left, window.innerWidth - POPOVER_WIDTH - 8),
				top: openUpward
					? anchorRect.top - 8 - POPOVER_HEIGHT
					: anchorRect.bottom + 8,
				zIndex: 2147483000,
				width: POPOVER_WIDTH,
				background: "white",
				border: "1.5px solid #e2e8f0",
				borderRadius: 12,
				padding: 12,
				boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
				fontFamily: FONT,
				display: "flex",
				flexDirection: "column",
				gap: 10,
			}}>
			<FieldLabel>Icon color</FieldLabel>
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<input
					type='color'
					aria-label='Color wheel'
					value={isValidHex(color) ? color : "#000000"}
					onChange={(e) => {
						onChange(e.target.value);
						setHexInput(e.target.value);
					}}
					style={{
						width: 36,
						height: 36,
						padding: 0,
						border: "1.5px solid #e2e8f0",
						borderRadius: 8,
						cursor: "pointer",
						flexShrink: 0,
					}}
				/>
				<input
					type='text'
					aria-label='Hex color value'
					value={hexInput}
					onChange={(e) => {
						const v = e.target.value;
						setHexInput(v);
						if (isValidHex(v)) onChange(v);
					}}
					placeholder='#000000'
					style={{
						flex: 1,
						minWidth: 0,
						fontSize: 13,
						fontFamily: "ui-monospace,monospace",
						border: "1.5px solid #e2e8f0",
						borderRadius: 8,
						padding: "7px 8px",
						color: isValidHex(hexInput) ? "#334155" : "#ef4444",
					}}
				/>
			</div>
			<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
				{PRESET_COLORS.map((c) => (
					<button
						key={c}
						title={c}
						onClick={() => {
							onChange(c);
							setHexInput(c);
						}}
						style={{
							width: 20,
							height: 20,
							borderRadius: "50%",
							background: c,
							border: "2px solid white",
							boxShadow: "0 0 0 1px #e2e8f0",
							cursor: "pointer",
						}}
					/>
				))}
			</div>
		</div>,
		document.body,
	);
};

/**
 * Custom-styled animation picker, anchored to its trigger button's live
 * `getBoundingClientRect()` and rendered via a portal - a native `<select>`
 * renders with the OS's own dropdown chrome (inconsistent styling, can
 * overlay unrelated page content), so this instead matches the rest of the
 * toolbar's design.
 */
const AnimationSelect: React.FC<{
	anchorRect: DOMRect;
	value: LayerAnimationPreset;
	onChange: (value: LayerAnimationPreset) => void;
	onClose: () => void;
}> = ({ anchorRect, value, onChange, onClose }) => {
	const popoverRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		const onPointerDown = (e: PointerEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onClose]);

	const POPOVER_HEIGHT = ANIMATION_OPTIONS.length * 34 + 10;
	const POPOVER_WIDTH = 132;
	const openUpward =
		anchorRect.bottom + 6 + POPOVER_HEIGHT > window.innerHeight;

	return createPortal(
		<div
			ref={popoverRef}
			onPointerDown={(e) => e.stopPropagation()}
			style={{
				position: "fixed",
				left: Math.min(anchorRect.left, window.innerWidth - POPOVER_WIDTH - 8),
				top: openUpward
					? anchorRect.top - 6 - POPOVER_HEIGHT
					: anchorRect.bottom + 6,
				zIndex: 2147483000,
				width: POPOVER_WIDTH,
				background: "white",
				border: "1.5px solid #e2e8f0",
				borderRadius: 10,
				padding: 5,
				boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
				fontFamily: FONT,
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}>
			{ANIMATION_OPTIONS.map((opt) => (
				<button
					key={opt.value}
					onClick={() => {
						onChange(opt.value);
						onClose();
					}}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						border: "none",
						width: "100%",
						textAlign: "left",
						padding: "6px 8px",
						fontSize: 13,
						fontWeight: opt.value === value ? 700 : 500,
						borderRadius: 6,
						cursor: "pointer",
						background: opt.value === value ? "#eff6ff" : "transparent",
						color: opt.value === value ? ACCENT : "#334155",
					}}
					onMouseEnter={(e) => {
						if (opt.value !== value)
							e.currentTarget.style.background = "#f8fafc";
					}}
					onMouseLeave={(e) => {
						if (opt.value !== value)
							e.currentTarget.style.background = "transparent";
					}}>
					<span style={{ width: 16, textAlign: "center" }} aria-hidden>
						{opt.glyph}
					</span>
					{opt.label}
				</button>
			))}
		</div>,
		document.body,
	);
};

const IconButton: React.FC<{
	iconName: string;
	fallback: string;
	title: string;
	onClick: () => void;
	disabled?: boolean;
	active?: boolean;
}> = ({
	iconName,
	fallback,
	title,
	onClick,
	disabled = false,
	active = false,
}) => {
	const Icon = useLucideIcon(iconName);
	return (
		<button
			title={title}
			aria-label={title}
			disabled={disabled}
			onPointerDown={(e) => e.stopPropagation()}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			style={{
				width: 36,
				height: 36,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				border: "none",
				background: active ? "#eff6ff" : "transparent",
				borderRadius: 8,
				cursor: disabled ? "default" : "pointer",
				color: disabled ? "#cbd5e1" : active ? ACCENT : "#334155",
				flexShrink: 0,
			}}
			onMouseEnter={(e) => {
				if (!disabled) e.currentTarget.style.background = "#f1f5f9";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = "transparent";
			}}>
			{Icon ? (
				<Icon size={18} />
			) : (
				<span style={{ fontSize: 15 }}>{fallback}</span>
			)}
		</button>
	);
};

export interface LayerToolbarProps {
	selected: LayerDef | null;
	onAdd: () => void;
	onTogglePanel: () => void;
	panelOpen: boolean;
	layerCount: number;
	onBringToFront: (id: string) => void;
	onSendToBack: (id: string) => void;
	onDuplicate: (id: string) => void;
	onDelete: (id: string) => void;
	onExport: () => void;
	onAnimationChange: (id: string, animation: LayerAnimation) => void;
	onOpacityChange: (id: string, opacity: number) => void;
	onColorChange: (id: string, color: string) => void;
	/** Omit to hide the breakpoint switcher entirely (e.g. a single bounded LayerScene, which resolves its breakpoint from its own width instead). */
	breakpoint?: LayerBreakpoint;
	onBreakpointChange?: (bp: LayerBreakpoint) => void;
	defaultCorner?: React.CSSProperties;
	position?: "absolute" | "fixed";
	zIndex?: number;
	/** Reports the toolbar's own rendered height (px) whenever it changes - e.g. when it wraps onto a second row - so a caller reserving layout space around it (see `LayerScene`) can stay in sync instead of assuming a fixed height. */
	onHeightChange?: (height: number) => void;
	/**
	 * Viewport-coordinate rect (e.g. the owning `LayerScene`'s own
	 * `getBoundingClientRect()`) to anchor `defaultCorner`'s offsets to. Always
	 * rendered via a portal to `document.body` and positioned `fixed` relative
	 * to the viewport - passing this keeps the toolbar visually near an
	 * arbitrary element on the page without its DOM node living inside that
	 * element's own ancestry, so no ancestor `overflow: hidden`/small
	 * container can ever clip it.
	 */
	anchorRect?: AnchorRect | null;
}

/**
 * Shared floating, draggable toolbar used identically by every `LayerScene`
 * instance AND `SpotsEditProvider`'s page-wide `backgroundLayers` canvas -
 * one implementation, so they can never drift apart. Grab the ⠿ handle to
 * reposition it anywhere on screen; it never affects layout since it's
 * always absolutely/fixed positioned. Always portalled to `document.body`
 * (see `anchorRect`) so it's never clipped by wherever its owner happens to
 * be mounted in the consumer's DOM tree.
 */
export const LayerToolbar: React.FC<LayerToolbarProps> = ({
	selected,
	onAdd,
	onTogglePanel,
	panelOpen,
	layerCount,
	onBringToFront,
	onSendToBack,
	onDuplicate,
	onDelete,
	onExport,
	onAnimationChange,
	onOpacityChange,
	onColorChange,
	breakpoint,
	onBreakpointChange,
	defaultCorner = { top: 0, left: 0 },
	position = "absolute",
	zIndex = 50,
	onHeightChange,
	anchorRect,
}) => {
	const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
	const [animationPickerOpen, setAnimationPickerOpen] = React.useState(false);
	const [exportLabel, setExportLabel] = React.useState<string | null>(null);
	const { ref, style, dragHandleProps } = useDraggable(
		defaultCorner,
		anchorRect ? "fixed" : position,
		anchorRect,
	);
	const outerRef = React.useRef<HTMLDivElement | null>(null);
	const colorButtonRef = React.useRef<HTMLButtonElement | null>(null);
	const animationButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const setRefs = React.useCallback(
		(el: HTMLDivElement | null) => {
			ref(el);
			outerRef.current = el;
		},
		[ref],
	);

	React.useEffect(() => {
		const el = outerRef.current;
		if (!el || !onHeightChange) return;
		const ro = new ResizeObserver((entries) => {
			onHeightChange(entries[0].contentRect.height);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, [onHeightChange]);

	// Selecting a different layer (or deselecting) closes any open popovers.
	React.useEffect(() => {
		setColorPickerOpen(false);
		setAnimationPickerOpen(false);
	}, [selected?.id]);

	return createPortal(
		<div
			ref={setRefs}
			style={{
				...style,
				zIndex,
				minHeight: 52,
				display: "flex",
				flexWrap: "wrap",
				maxWidth: "min(720px, calc(100vw - 24px))",
				alignItems: "center",
				gap: 8,
				background: "white",
				border: "1.5px solid #e2e8f0",
				borderRadius: 14,
				padding: 8,
				boxShadow: "0 6px 20px rgba(15,23,42,0.14)",
				fontFamily: FONT,
			}}>
			<div
				title='Drag to move'
				{...dragHandleProps}
				style={{
					width: 16,
					height: 32,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "grab",
					color: "#cbd5e1",
					fontSize: 15,
					flexShrink: 0,
					touchAction: "none",
				}}>
				⠿
			</div>

			<LabeledGroup label='Layers'>
				<IconButton
					iconName='Plus'
					fallback='+'
					title='Add icon layer'
					onClick={onAdd}
				/>
				<IconButton
					iconName='ListTree'
					fallback='☰'
					title={`Layers (${layerCount})`}
					active={panelOpen}
					onClick={onTogglePanel}
				/>
			</LabeledGroup>

			<LabeledGroup label='Arrange'>
				<IconButton
					iconName='ArrowUpToLine'
					fallback='⬆'
					title='Bring to front'
					disabled={!selected}
					onClick={() => selected && onBringToFront(selected.id)}
				/>
				<IconButton
					iconName='ArrowDownToLine'
					fallback='⬇'
					title='Send to back'
					disabled={!selected}
					onClick={() => selected && onSendToBack(selected.id)}
				/>
				<IconButton
					iconName='Copy'
					fallback='⧉'
					title='Duplicate layer'
					disabled={!selected}
					onClick={() => selected && onDuplicate(selected.id)}
				/>
				<IconButton
					iconName='Trash2'
					fallback='🗑'
					title='Delete layer'
					disabled={!selected}
					onClick={() => selected && onDelete(selected.id)}
				/>
			</LabeledGroup>

			<LabeledGroup label='Export'>
				<IconButton
					iconName='Download'
					fallback='⭳'
					title='Export layers (copies JSON to clipboard)'
					onClick={() => {
						onExport();
						setExportLabel("Copied!");
						setTimeout(() => setExportLabel(null), 1500);
					}}
				/>
				{exportLabel && (
					<span
						style={{
							fontSize: 12,
							fontWeight: 700,
							color: "#059669",
							whiteSpace: "nowrap",
						}}>
						{exportLabel}
					</span>
				)}
			</LabeledGroup>

			{breakpoint && onBreakpointChange && (
				<LabeledGroup label='View'>
					{BREAKPOINTS.map((bp) => (
						<button
							key={bp}
							onPointerDown={(e) => e.stopPropagation()}
							onClick={(e) => {
								e.stopPropagation();
								onBreakpointChange(bp);
							}}
							style={{
								border: "none",
								padding: "6px 10px",
								fontSize: 12,
								fontWeight: 600,
								borderRadius: 7,
								cursor: "pointer",
								background: breakpoint === bp ? ACCENT : "transparent",
								color: breakpoint === bp ? "white" : "#475569",
								textTransform: "capitalize",
								whiteSpace: "nowrap",
							}}>
							{bp}
						</button>
					))}
				</LabeledGroup>
			)}

			{(() => {
				// Always rendered (never conditional on `selected` or on the
				// current animation type) so the toolbar's own height/row count
				// never shifts depending on selection state - controls disable
				// themselves instead of disappearing. See the scene box's own
				// "fixed size, always" rule for the same reasoning.
				const currentType: LayerAnimationPreset | null = !selected
					? null
					: typeof selected.animation === "string"
						? selected.animation
						: selected.animation && "type" in selected.animation
							? selected.animation.type
							: "none";
				const currentConfig =
					selected &&
					selected.animation &&
					typeof selected.animation === "object" &&
					"type" in selected.animation
						? selected.animation
						: null;
				const effectiveDuration =
					currentConfig?.duration ??
					(currentType ? PRESET_DURATION_SECONDS[currentType] : undefined) ??
					3;
				const effectiveIntensity =
					currentConfig?.intensity ??
					(currentType ? PRESET_DEFAULT_INTENSITY[currentType] : undefined) ??
					0.3;
				const speedDisabled = !selected || currentType === "none";
				const intensityDisabled =
					!selected || currentType === "none" || currentType === "spin";
				const colorDisabled = !selected || selected.type !== "icon";

				const commitConfig = (patch: {
					duration?: number;
					intensity?: number;
				}) => {
					if (!selected || !currentType) return;
					onAnimationChange(selected.id, {
						type: currentType,
						duration: patch.duration ?? effectiveDuration,
						intensity: patch.intensity ?? effectiveIntensity,
					});
				};

				return (
					<>
						<Group>
							<div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<FieldLabel>Layer</FieldLabel>
								<span
									style={{
										fontSize: 12,
										fontWeight: 600,
										color: selected ? "#334155" : "#cbd5e1",
										maxWidth: 110,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
									}}>
									{selected
										? selected.type === "image"
											? selected.alt || selected.id
											: selected.iconName
										: "None selected"}
								</span>
							</div>

							<div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<FieldLabel>Animation</FieldLabel>
								<button
									ref={animationButtonRef}
									title='Animation'
									aria-label='Animation'
									disabled={!selected}
									onPointerDown={(e) => e.stopPropagation()}
									onClick={(e) => {
										e.stopPropagation();
										setAnimationPickerOpen((o) => !o);
									}}
									style={{
										display: "flex",
										alignItems: "center",
										gap: 6,
										fontSize: 12,
										fontWeight: 600,
										color: selected ? "#334155" : "#cbd5e1",
										border: "1.5px solid #e2e8f0",
										borderRadius: 7,
										padding: "6px 8px",
										background: "white",
										cursor: selected ? "pointer" : "default",
									}}>
									<span aria-hidden>
										{ANIMATION_OPTIONS.find((o) => o.value === currentType)
											?.glyph ?? "-"}
									</span>
									{ANIMATION_OPTIONS.find((o) => o.value === currentType)
										?.label ?? "None"}
									<span style={{ fontSize: 9, color: "#94a3b8" }} aria-hidden>
										▾
									</span>
								</button>
								{selected &&
									animationPickerOpen &&
									currentType &&
									animationButtonRef.current &&
									(() => {
										const rect =
											animationButtonRef.current!.getBoundingClientRect();
										return (
											<AnimationSelect
												anchorRect={rect}
												value={currentType}
												onChange={(v) => onAnimationChange(selected.id, v)}
												onClose={() => setAnimationPickerOpen(false)}
											/>
										);
									})()}
							</div>

							<div
								title={`Speed: ${effectiveDuration.toFixed(1)}s`}
								style={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<FieldLabel>Speed</FieldLabel>
								<input
									type='range'
									aria-label='Animation speed'
									min={1}
									max={6}
									step={0.1}
									value={effectiveDuration}
									disabled={speedDisabled}
									onPointerDown={(e) => e.stopPropagation()}
									onChange={(e) =>
										commitConfig({ duration: Number(e.target.value) })
									}
									style={{
										width: 64,
										cursor: speedDisabled ? "default" : "pointer",
										opacity: speedDisabled ? 0.4 : 1,
									}}
								/>
							</div>

							<div
								title={`Intensity: ${Math.round(effectiveIntensity * 100)}%`}
								style={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<FieldLabel>Intensity</FieldLabel>
								<input
									type='range'
									aria-label='Animation intensity'
									min={0}
									max={100}
									step={1}
									value={Math.round(effectiveIntensity * 100)}
									disabled={intensityDisabled}
									onPointerDown={(e) => e.stopPropagation()}
									onChange={(e) =>
										commitConfig({ intensity: Number(e.target.value) / 100 })
									}
									style={{
										width: 64,
										cursor: intensityDisabled ? "default" : "pointer",
										opacity: intensityDisabled ? 0.4 : 1,
									}}
								/>
							</div>
						</Group>

						<Group>
							<div
								title={`Opacity: ${Math.round(((selected?.opacity ?? 1) as number) * 100)}%`}
								style={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<FieldLabel>Opacity</FieldLabel>
								<input
									type='range'
									aria-label='Opacity'
									min={0}
									max={100}
									step={1}
									value={Math.round((selected?.opacity ?? 1) * 100)}
									disabled={!selected}
									onPointerDown={(e) => e.stopPropagation()}
									onChange={(e) =>
										selected &&
										onOpacityChange(selected.id, Number(e.target.value) / 100)
									}
									style={{
										width: 64,
										cursor: selected ? "pointer" : "default",
										opacity: selected ? 1 : 0.4,
									}}
								/>
							</div>

							<div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
								<FieldLabel>Color</FieldLabel>
								<button
									ref={colorButtonRef}
									title='Icon color'
									aria-label='Icon color'
									disabled={colorDisabled}
									onPointerDown={(e) => e.stopPropagation()}
									onClick={(e) => {
										e.stopPropagation();
										setColorPickerOpen((o) => !o);
									}}
									style={{
										width: 26,
										height: 26,
										borderRadius: "50%",
										background: colorDisabled
											? "#e2e8f0"
											: ((selected as IconLayerDef).color ?? "#64748b"),
										border: "2px solid white",
										boxShadow: "0 0 0 1.5px #e2e8f0",
										cursor: colorDisabled ? "default" : "pointer",
									}}
								/>
								{!colorDisabled &&
									selected &&
									colorPickerOpen &&
									colorButtonRef.current &&
									(() => {
										const rect =
											colorButtonRef.current!.getBoundingClientRect();
										return (
											<ColorPopover
												anchorRect={rect}
												color={(selected as IconLayerDef).color ?? "#64748b"}
												onChange={(c) => onColorChange(selected.id, c)}
												onClose={() => setColorPickerOpen(false)}
											/>
										);
									})()}
							</div>
						</Group>
					</>
				);
			})()}
		</div>,
		document.body,
	);
};
