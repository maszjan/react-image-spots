export { ImageSpotMap } from "./ImageSpotMap";
export { SceneChain } from "./SceneChain";
export { LayerScene } from "./LayerScene";
export {
	SpotsEditProvider,
	useSpotsEditContext,
	useSpotsEdit,
} from "./SpotsEditProvider";
export { resolveIcon, useLucideIcon, LUCIDE_ICON_NAMES, searchIcons } from "./iconRegistry";

export type {
	ImageSpotMapProps,
	Position,
	SceneChainProps,
	SceneDef,
	SpotDef,
	SpotRenderProps,
	SpotSize,
	SwapAnimation,
	SwapAnimationCustom,
	SwapAnimationPreset,
	LayerDef,
	ImageLayerDef,
	IconLayerDef,
	LayerAnimation,
	LayerAnimationConfig,
	LayerAnimationCustom,
	LayerAnimationPreset,
	LayerSceneProps,
	LayerBreakpoint,
	LayerBreakpointOverride,
	LayerBreakpointThresholds,
	LayerResponsiveOverrides,
	LayerSceneHandle,
	LucideIconName,
} from "./types";
export type { SpotsEditProviderProps } from "./SpotsEditProvider";
