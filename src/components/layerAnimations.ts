import type {
	LayerAnimation,
	LayerAnimationConfig,
	LayerAnimationCustom,
	LayerAnimationPreset,
} from "../types";

export interface ResolvedLayerAnimation {
	css: string;
	animation: string;
}

const D = 3000;

const PRESETS: Record<
	LayerAnimationPreset,
	(d: number) => ResolvedLayerAnimation
> = {
	none: () => ({ css: "", animation: "" }),

	// Subtle, slow drift - not a pronounced bounce (see skill notes: a past
	// regression shipped this too fast/strong for decorative icon layers).
	float: (d) => ({
		css: `@keyframes ris-layer-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`,
		animation: `ris-layer-float ${d}ms ease-in-out infinite`,
	}),

	pulse: (d) => ({
		css: `@keyframes ris-layer-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }`,
		animation: `ris-layer-pulse ${d}ms ease-in-out infinite`,
	}),

	spin: (d) => ({
		css: `@keyframes ris-layer-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
		animation: `ris-layer-spin ${d}ms linear infinite`,
	}),

	sway: (d) => ({
		css: `@keyframes ris-layer-sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }`,
		animation: `ris-layer-sway ${d}ms ease-in-out infinite`,
	}),
};

/** Default duration (seconds) per preset - used both for the plain string shorthand and as the fallback when a `LayerAnimationConfig` omits `duration`. */
export const PRESET_DURATION_SECONDS: Partial<Record<LayerAnimationPreset, number>> = {
	float: 4,
	pulse: 2.2,
	spin: 6,
	sway: 3.2,
};

const PRESET_DURATIONS_MS: Partial<Record<LayerAnimationPreset, number>> = {
	float: 4000,
	pulse: 2200,
	spin: 6000,
	sway: 3200,
};

/**
 * Default intensity (0-1) per preset, chosen so a `LayerAnimationConfig`
 * with no explicit `intensity` renders identically to the original
 * hardcoded preset (float -6px, pulse 0.6 opacity trough, sway ±3deg).
 */
export const PRESET_DEFAULT_INTENSITY: Partial<Record<LayerAnimationPreset, number>> = {
	float: 0.3,
	pulse: 0.5,
	sway: 0.3,
};

// Amplitude at intensity = 1.
const FLOAT_MAX_PX = 20;
const PULSE_MAX_OPACITY_SWING = 0.8;
const SWAY_MAX_DEG = 10;

function resolveConfig(config: LayerAnimationConfig): ResolvedLayerAnimation {
	const { type } = config;
	if (type === "none") return { css: "", animation: "" };

	const durationMs =
		config.duration != null
			? Math.max(0, config.duration) * 1000
			: (PRESET_DURATIONS_MS[type] ?? D);
	const intensity = Math.min(
		1,
		Math.max(0, config.intensity ?? PRESET_DEFAULT_INTENSITY[type] ?? 0.3),
	);
	const name = `ris-layer-${type}-${Math.round(intensity * 100)}`;

	switch (type) {
		case "float": {
			const px = Math.round(intensity * FLOAT_MAX_PX);
			return {
				css: `@keyframes ${name} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-${px}px); } }`,
				animation: `${name} ${durationMs}ms ease-in-out infinite`,
			};
		}
		case "pulse": {
			const trough = Math.max(0, 1 - intensity * PULSE_MAX_OPACITY_SWING);
			return {
				css: `@keyframes ${name} { 0%, 100% { opacity: 1; } 50% { opacity: ${trough.toFixed(2)}; } }`,
				animation: `${name} ${durationMs}ms ease-in-out infinite`,
			};
		}
		case "spin":
			// Intensity doesn't apply - always a full rotation, only speed varies.
			return {
				css: `@keyframes ris-layer-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
				animation: `ris-layer-spin ${durationMs}ms linear infinite`,
			};
		case "sway": {
			const deg = Math.round(intensity * SWAY_MAX_DEG) || 1;
			return {
				css: `@keyframes ${name} { 0%, 100% { transform: rotate(-${deg}deg); } 50% { transform: rotate(${deg}deg); } }`,
				animation: `${name} ${durationMs}ms ease-in-out infinite`,
			};
		}
		default:
			return { css: "", animation: "" };
	}
}

export function resolveLayerAnimation(
	anim: LayerAnimation = "none",
): ResolvedLayerAnimation {
	if (typeof anim === "string") {
		const duration = PRESET_DURATIONS_MS[anim] ?? D;
		return (PRESETS[anim] ?? PRESETS.none)(duration);
	}
	if ("type" in anim) {
		return resolveConfig(anim);
	}
	const custom = anim as LayerAnimationCustom;
	return { css: "", animation: custom.keyframes };
}
