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
	/** Duration ms — used to time the swap. Default: 400 */
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
	/** Per-spot swap animation — overrides global */
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
