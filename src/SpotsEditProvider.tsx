import React, {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { LayerScene } from "./LayerScene";
import { LayerPanel } from "./components/LayerPanel";
import { LayerToolbar } from "./components/LayerToolbar";
import type { LayerBreakpoint, LayerDef, LayerSceneHandle } from "./types";

interface SpotsEditContextValue {
	editMode: boolean;
	setEditMode: (editMode: boolean) => void;
	/** Currently simulated device-preview breakpoint (informational - LayerScene resolves its own breakpoint from measured width, it doesn't need this). */
	breakpoint: LayerBreakpoint;
	setBreakpoint: (breakpoint: LayerBreakpoint) => void;
}

const noop = () => {};

const SpotsEditContext = createContext<SpotsEditContextValue>({
	editMode: false,
	setEditMode: noop,
	breakpoint: "desktop",
	setBreakpoint: noop,
});

export interface SpotsEditProviderProps {
	/** Initial edit mode when uncontrolled. Default: false */
	defaultEditMode?: boolean;
	/** Controlled edit mode - omit to let the provider manage its own state via the built-in toggle */
	editMode?: boolean;
	onEditModeChange?: (editMode: boolean) => void;
	/** Show the built-in floating edit-mode toggle button. Default: true - set `false` to drive `editMode` from your own UI elsewhere on the page instead. */
	showToggle?: boolean;
	/** Show the Mobile/Tablet/Desktop breakpoint switcher inside the background-layers toolbar while editing. Default: true */
	showBreakpointSwitcher?: boolean;
	togglePosition?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	/** Simulated widths (px) for the Mobile/Tablet device-preview frame that wraps `children`. Desktop = no frame (full width). */
	frameWidths?: { mobile: number; tablet: number };
	/**
	 * Page-wide decorative image/icon layers, positioned in % over the full
	 * height of `children` - not confined to any single LayerScene's box.
	 * Place a layer at y: 60 to land it over whatever section happens to sit
	 * 60% down the page. Purely decorative in preview (click-through,
	 * pointer-events: none) so it never blocks real page content; becomes
	 * draggable/selectable like any other LayerScene while editing, with the
	 * same floating, draggable toolbar + layers panel every LayerScene uses.
	 */
	backgroundLayers?: LayerDef[];
	onBackgroundLayersChange?: (layers: LayerDef[]) => void;
	onBackgroundExport?: (layers: LayerDef[]) => void;
	autoExportBackgroundOnChange?: boolean;
	children: ReactNode;
}

const DEFAULT_FRAME_WIDTHS = { mobile: 375, tablet: 768 };
const FONT = "system-ui,sans-serif";
const ACCENT = "#3b82f6";

const POSITION_STYLE: Record<
	NonNullable<SpotsEditProviderProps["togglePosition"]>,
	React.CSSProperties
> = {
	"bottom-right": { bottom: 16, right: 16 },
	"bottom-left": { bottom: 16, left: 16 },
	"top-right": { top: 16, right: 16 },
	"top-left": { top: 16, left: 16 },
};

/**
 * The toolbar + layers panel for `backgroundLayers` - the exact same shared
 * `<LayerToolbar>`/`<LayerPanel>` components every `LayerScene` uses, just
 * pointed at the background layer list via `LayerSceneHandle` (since that
 * LayerScene instance renders with `showChrome={false}` - its own layers are
 * scattered across the whole page, so its chrome is driven from here
 * instead of its own in-flow toolbar). Fixed to the viewport, floating and
 * draggable, never inside any scene box.
 */
const BackgroundLayersEditor: React.FC<{
	layers: LayerDef[];
	sceneRef: React.RefObject<LayerSceneHandle | null>;
	selected: LayerDef | null;
	breakpoint: LayerBreakpoint;
	onBreakpointChange: (bp: LayerBreakpoint) => void;
	showBreakpointSwitcher: boolean;
}> = ({
	layers,
	sceneRef,
	selected,
	breakpoint,
	onBreakpointChange,
	showBreakpointSwitcher,
}) => {
	const [panelOpen, setPanelOpen] = useState(false);

	const call = useCallback(
		<K extends keyof LayerSceneHandle>(
			method: K,
			...args: Parameters<LayerSceneHandle[K]>
		) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(sceneRef.current?.[method] as any)?.(...args);
		},
		[sceneRef],
	);

	return (
		<>
			<LayerToolbar
				selected={selected}
				layerCount={layers.length}
				panelOpen={panelOpen}
				onTogglePanel={() => setPanelOpen((o) => !o)}
				onAdd={() => call("openIconBrowser")}
				onBringToFront={(id) => call("bringToFront", id)}
				onSendToBack={(id) => call("sendToBack", id)}
				onDuplicate={(id) => call("duplicateLayer", id)}
				onDelete={(id) => call("deleteLayer", id)}
				onExport={() => call("exportLayers")}
				onAnimationChange={(id, animation) =>
					call("updateLayerField", id, { animation })
				}
				onOpacityChange={(id, opacity) =>
					call("updateLayerField", id, { opacity })
				}
				onColorChange={(id, color) => call("updateLayerField", id, { color })}
				breakpoint={showBreakpointSwitcher ? breakpoint : undefined}
				onBreakpointChange={
					showBreakpointSwitcher ? onBreakpointChange : undefined
				}
				defaultCorner={{ top: 12, left: 16 }}
				position='fixed'
				zIndex={2147483000}
			/>
			{panelOpen && (
				<LayerPanel
					title='Background layers'
					layers={layers}
					selectedId={selected?.id ?? null}
					onSelect={(id) => call("selectLayer", id)}
					defaultCorner={{ top: 64, left: 16 }}
					position='fixed'
					zIndex={2147483000}
				/>
			)}
		</>
	);
};

/**
 * Wraps your whole app (or a page) once. Its built-in floating toggle flips
 * edit mode for every LayerScene underneath it at the same time - no need to
 * wire up your own switch or pass `mode` to each LayerScene individually. An
 * explicit `mode` prop on an individual LayerScene always overrides this.
 *
 * The Mobile/Tablet breakpoint buttons (inside the background-layers
 * toolbar while editing) simulate a device viewport by resizing `children`
 * itself (not just one component) to that width, so you can see and edit
 * the whole page's real responsive layout - LayerScene resolves its own
 * breakpoint from its rendered width, so it reacts correctly once wrapped
 * in the narrower frame.
 */
export const SpotsEditProvider: React.FC<SpotsEditProviderProps> = ({
	defaultEditMode = false,
	editMode: controlledEditMode,
	onEditModeChange,
	showToggle = true,
	showBreakpointSwitcher = true,
	togglePosition = "bottom-right",
	frameWidths = DEFAULT_FRAME_WIDTHS,
	backgroundLayers,
	onBackgroundLayersChange,
	onBackgroundExport,
	autoExportBackgroundOnChange,
	children,
}) => {
	const isControlled = controlledEditMode !== undefined;
	const [internalEditMode, setInternalEditMode] = useState(defaultEditMode);
	const editMode = isControlled ? controlledEditMode! : internalEditMode;
	const [breakpoint, setBreakpointState] = useState<LayerBreakpoint>("desktop");
	const bgSceneRef = useRef<LayerSceneHandle>(null);
	const [selectedBgLayer, setSelectedBgLayer] = useState<LayerDef | null>(null);

	const setEditMode = useCallback(
		(next: boolean) => {
			if (!isControlled) setInternalEditMode(next);
			onEditModeChange?.(next);
		},
		[isControlled, onEditModeChange],
	);

	const setBreakpoint = useCallback((bp: LayerBreakpoint) => {
		setBreakpointState(bp);
	}, []);

	const frameWidth = editMode
		? breakpoint === "mobile"
			? frameWidths.mobile
			: breakpoint === "tablet"
				? frameWidths.tablet
				: null
		: null;

	const content = (
		<div style={{ position: "relative" }}>
			{children}
			{backgroundLayers && (
				<div
					style={{
						position: "absolute",
						inset: 0,
						// LayerScene itself (showChrome=false) keeps its own empty
						// space click-through and only its layer elements become
						// hit targets while editing - see LayerScene.tsx.
						pointerEvents: "none",
						zIndex: 500,
					}}>
					<LayerScene
						ref={bgSceneRef}
						layers={backgroundLayers}
						onChange={onBackgroundLayersChange}
						onExport={onBackgroundExport}
						autoExportOnChange={autoExportBackgroundOnChange}
						showChrome={false}
						onSelectedLayerChange={setSelectedBgLayer}
					/>
				</div>
			)}
		</div>
	);

	return (
		<SpotsEditContext.Provider
			value={{ editMode, setEditMode, breakpoint, setBreakpoint }}>
			{frameWidth ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						background: "#94a3b833",
						minHeight: "100vh",
						padding: "24px 0",
					}}>
					<div
						style={{
							width: frameWidth,
							maxWidth: "100%",
							background: "white",
							boxShadow:
								"0 0 0 1px rgba(15,23,42,0.1), 0 24px 60px rgba(15,23,42,0.18)",
							borderRadius: 12,
							overflow: "hidden",
						}}>
						{content}
					</div>
				</div>
			) : (
				content
			)}

			{editMode && backgroundLayers && (
				<BackgroundLayersEditor
					layers={backgroundLayers}
					sceneRef={bgSceneRef}
					selected={selectedBgLayer}
					breakpoint={breakpoint}
					onBreakpointChange={setBreakpoint}
					showBreakpointSwitcher={showBreakpointSwitcher}
				/>
			)}

			{showToggle && (
				<button
					onClick={() => setEditMode(!editMode)}
					style={{
						position: "fixed",
						...POSITION_STYLE[togglePosition],
						zIndex: 2147483000,
						border: "none",
						borderRadius: 999,
						padding: "10px 18px",
						fontSize: 13,
						fontWeight: 700,
						cursor: "pointer",
						color: "white",
						background: editMode ? "#0f172a" : ACCENT,
						boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
						fontFamily: FONT,
					}}>
					{editMode ? "✓ Editing - click to exit" : "✎ Edit this page"}
				</button>
			)}
		</SpotsEditContext.Provider>
	);
};

/** Returns whether edit mode is currently on. Defaults to `false` outside a provider. */
export function useSpotsEditContext(): boolean {
	return useContext(SpotsEditContext).editMode;
}

/** Full edit-mode context - edit mode, the simulated device-preview breakpoint, and setters for both. */
export function useSpotsEdit(): SpotsEditContextValue {
	return useContext(SpotsEditContext);
}
