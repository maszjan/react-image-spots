import type { CSSProperties, MouseEvent, ReactNode } from "react";

export interface Position {
	x: number;
	y: number;
}

export interface SpotSize {
	w: number;
	h: number;
}

export interface SpotRenderProps {
	isHovered: boolean;
	isActive: boolean;
	onMouseEnter: (e: MouseEvent) => void;
	onMouseLeave: (e: MouseEvent) => void;
	onClick: (e: MouseEvent) => void;
	goTo: (sceneId: string) => void;
	goBack: () => void;
	canGoBack: boolean;
}

export type SwapAnimationPreset =
	| "fade"
	| "blur"
	| "zoom"
	| "zoom-out"
	| "slide-up"
	| "slide-down"
	| "slide-left"
	| "slide-right"
	| "flip"
	| "glitch"
	| "none";

export interface SwapAnimationCustom {
	/** Animation string for incoming image e.g. "my-anim 400ms ease forwards" */
	enter: string;
	/** Animation string for outgoing image (optional) */
	leave?: string;
	/** Duration ms - used to time the swap. Default: 400 */
	duration?: number;
}

export type SwapAnimation = SwapAnimationPreset | SwapAnimationCustom;

export interface SpotDef {
	id: string;
	position: Position;
	size?: SpotSize;
	render: (props: SpotRenderProps) => ReactNode;
	hoverSrc?: string;
	activeSrc?: string;
	/** Per-spot swap animation - overrides global */
	swapAnimation?: SwapAnimation;
}

export interface ImageSpotMapProps {
	src: string;
	alt?: string;
	mode?: "preview" | "edit";
	spots?: SpotDef[];
	enableImageSwap?: boolean;
	swapDuration?: number;
	hideOthersOnHover?: boolean;
	hideHoveredSpot?: boolean;
	/** Global swap animation. Default: 'fade' */
	swapAnimation?: SwapAnimation;
	onSpotHover?: (spot: SpotDef | null) => void;
	onSpotClick?: (spot: SpotDef) => void;
	onSpotLeave?: (spot: SpotDef) => void;
	onSpotPlace?: (position: Position, index: number) => void;
	_goTo?: (sceneId: string) => void;
	_goBack?: () => void;
	_canGoBack?: boolean;
	className?: string;
	style?: CSSProperties;
}

export interface SceneDef {
	src: string;
	alt?: string;
	spots: SpotDef[];
}

export interface SceneChainProps {
	scenes: Record<string, SceneDef>;
	initialScene: string;
	transition?: "fade" | "none";
	transitionDuration?: number;
	enableImageSwap?: boolean;
	hideOthersOnHover?: boolean;
	swapAnimation?: SwapAnimation;
	renderBackButton?: (props: {
		goBack: () => void;
		canGoBack: boolean;
		history: string[];
	}) => ReactNode;
	showBackButton?: boolean;
	backButtonLabel?: string;
	showBreadcrumb?: boolean;
	onSceneChange?: (sceneId: string, scene: SceneDef) => void;
	onSpotClick?: (spot: SpotDef, sceneId: string) => void;
	className?: string;
	style?: CSSProperties;
}

export interface ImageConfig {
	id: string;
	src: string;
	alt: string;
	spots: SpotDef[];
}

export type LayerAnimationPreset = "none" | "float" | "pulse" | "spin" | "sway";

export interface LayerAnimationCustom {
	/** Animation string, e.g. "my-anim 3s ease-in-out infinite" */
	keyframes: string;
	/** Duration ms - used only if `keyframes` doesn't include its own duration. Default: 3000 */
	duration?: number;
}

/**
 * A preset with tunable parameters, instead of the fixed built-in look.
 * Omitted fields fall back to defaults chosen to match the plain preset
 * string's original (subtle) appearance exactly - configurability is
 * additive, not a change to the default look.
 */
export interface LayerAnimationConfig {
	type: LayerAnimationPreset;
	/** Seconds. Default varies by type: float 4s, pulse 2.2s, spin 6s, sway 3.2s */
	duration?: number;
	/**
	 * 0-1, controls amplitude: float = how far it drifts (px), pulse = how
	 * much opacity dips, sway = rotation range (degrees). Ignored for `spin`
	 * (always a full rotation) and `none`. Default varies by type so the
	 * unconfigured look matches the original preset exactly.
	 */
	intensity?: number;
}

export type LayerAnimation =
	| LayerAnimationPreset
	| LayerAnimationConfig
	| LayerAnimationCustom;

/**
 * Name of a lucide-react icon export, e.g. "Coffee", "MapPin".
 * Kept as `string` rather than a generated union: lucide-react ships 1000+ icons
 * and the set changes between versions, so a hand-maintained union would either
 * go stale or require a build-time codegen step this package doesn't have.
 * Valid names: https://lucide.dev/icons
 */
export type LucideIconName = string;

export type LayerBreakpoint = "mobile" | "tablet" | "desktop";

export interface LayerBreakpointOverride {
	position?: Position;
	width?: number;
	height?: number;
	size?: number;
	rotate?: number;
}

export type LayerResponsiveOverrides = Partial<
	Record<LayerBreakpoint, LayerBreakpointOverride>
>;

interface LayerDefBase {
	id: string;
	position: Position;
	rotate?: number;
	zIndex?: number;
	animation?: LayerAnimation;
	/** 0-1. Default: 1 (fully opaque) */
	opacity?: number;
	responsive?: LayerResponsiveOverrides;
}

export interface ImageLayerDef extends LayerDefBase {
	type: "image";
	src: string;
	alt?: string;
	width: number;
	height: number;
	dropShadow?: string;
}

export interface IconLayerDef extends LayerDefBase {
	type: "icon";
	iconName: LucideIconName;
	size: number;
	color?: string;
}

export type LayerDef = ImageLayerDef | IconLayerDef;

export interface LayerBreakpointThresholds {
	/** Max viewport width (px) still considered "mobile". Default: 640 */
	mobile: number;
	/** Max viewport width (px) still considered "tablet". Default: 1024 */
	tablet: number;
}

export interface LayerSceneProps {
	layers: LayerDef[];
	mode?: "preview" | "edit";
	onChange?: (layers: LayerDef[]) => void;
	onExport?: (layers: LayerDef[]) => void;
	autoExportOnChange?: boolean;
	/** Breakpoint width thresholds used to resolve `responsive` overrides in preview mode */
	breakpoints?: LayerBreakpointThresholds;
	/**
	 * Show the top toolbar (+ Add icon / Export) and the side layer-list
	 * panel while editing. Per-layer selection (toolbar, resize/rotate
	 * handles, live readout) still works either way. Default: true - set to
	 * `false` for a LayerScene that's stacked with another one in the same
	 * viewport (e.g. SpotsEditProvider's page-wide `backgroundLayers`
	 * canvas), so their chrome doesn't visually collide.
	 */
	showChrome?: boolean;
	/**
	 * Fired whenever the selected layer changes (including deselection). Lets
	 * a parent (e.g. `SpotsEditProvider`) drive its own external controls for
	 * a `showChrome={false}` instance via {@link LayerSceneHandle}.
	 */
	onSelectedLayerChange?: (layer: LayerDef | null) => void;
	className?: string;
	style?: CSSProperties;
}

/**
 * Imperative controls for a `LayerScene`, obtained via `ref`. Meant for a
 * parent driving its own external UI for a `showChrome={false}` instance
 * (see `SpotsEditProvider`'s `backgroundLayers`) - normal usage doesn't need
 * this, the built-in toolbar already calls these internally.
 */
export interface LayerSceneHandle {
	bringToFront: (id: string) => void;
	sendToBack: (id: string) => void;
	duplicateLayer: (id: string) => void;
	deleteLayer: (id: string) => void;
	updateLayerField: (id: string, patch: Partial<LayerDef>) => void;
	selectLayer: (id: string | null) => void;
	openIconBrowser: () => void;
	exportLayers: () => void;
}
