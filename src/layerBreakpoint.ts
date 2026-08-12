import type { LayerBreakpoint, LayerBreakpointThresholds } from "./types";

export const DEFAULT_BREAKPOINTS: LayerBreakpointThresholds = {
	mobile: 640,
	tablet: 1024,
};

/**
 * Resolves a breakpoint from a measured width - a LayerScene's own rendered
 * container width, not the browser window's. This makes breakpoint
 * resolution respond correctly to anything that constrains an ancestor's
 * width (a resizable panel, SpotsEditProvider's device-preview frame), not
 * just real window resizing.
 */
export function resolveBreakpointFromWidth(
	width: number,
	thresholds: LayerBreakpointThresholds = DEFAULT_BREAKPOINTS,
): LayerBreakpoint {
	if (width <= thresholds.mobile) return "mobile";
	if (width <= thresholds.tablet) return "tablet";
	return "desktop";
}
