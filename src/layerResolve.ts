import type {
	LayerBreakpoint,
	LayerBreakpointOverride,
	LayerDef,
	Position,
} from "./types";

export interface EffectiveLayerValues {
	position: Position;
	width?: number;
	height?: number;
	size?: number;
	rotate: number;
}

/** Resolves a layer's effective position/size/rotate for a given breakpoint - base values with `responsive[breakpoint]` overrides layered on top, field by field. */
export function getEffectiveLayerValues(
	layer: LayerDef,
	breakpoint: LayerBreakpoint,
): EffectiveLayerValues {
	const override = layer.responsive?.[breakpoint];
	return {
		position: override?.position ?? layer.position,
		width:
			layer.type === "image" ? (override?.width ?? layer.width) : undefined,
		height:
			layer.type === "image" ? (override?.height ?? layer.height) : undefined,
		size: layer.type === "icon" ? (override?.size ?? layer.size) : undefined,
		rotate: override?.rotate ?? layer.rotate ?? 0,
	};
}

/** Writes a patch of position/size/rotate fields to a layer at the given breakpoint - the base fields when editing "desktop", otherwise `responsive[breakpoint]`. */
export function updateLayerAtBreakpoint(
	layer: LayerDef,
	breakpoint: LayerBreakpoint,
	patch: LayerBreakpointOverride,
): LayerDef {
	if (breakpoint === "desktop") {
		return { ...layer, ...patch } as LayerDef;
	}
	return {
		...layer,
		responsive: {
			...layer.responsive,
			[breakpoint]: { ...layer.responsive?.[breakpoint], ...patch },
		},
	};
}
