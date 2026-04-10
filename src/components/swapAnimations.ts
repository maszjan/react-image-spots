import type {
	SwapAnimation,
	SwapAnimationCustom,
	SwapAnimationPreset,
} from "../types";

export interface ResolvedAnimation {
	css: string;
	enterAnimation: string;
	leaveAnimation?: string;
	duration: number;
}

const D = 400;

const PRESETS: Record<SwapAnimationPreset, (d: number) => ResolvedAnimation> = {
	fade: (d) => ({
		css: `@keyframes ris-fade-in { from { opacity:0 } to { opacity:1 } }`,
		enterAnimation: `ris-fade-in ${d}ms ease forwards`,
		duration: d,
	}),

	blur: (d) => ({
		css: `
@keyframes ris-blur-in  { from { filter:blur(12px); opacity:0 } to { filter:blur(0); opacity:1 } }
@keyframes ris-blur-out { from { filter:blur(0); opacity:1 } to { filter:blur(12px); opacity:0 } }`,
		enterAnimation: `ris-blur-in ${d}ms ease forwards`,
		leaveAnimation: `ris-blur-out ${d}ms ease forwards`,
		duration: d,
	}),

	zoom: (d) => ({
		css: `@keyframes ris-zoom-in { from { transform:scale(1.08); opacity:0 } to { transform:scale(1); opacity:1 } }`,
		enterAnimation: `ris-zoom-in ${d}ms ease forwards`,
		duration: d,
	}),

	"zoom-out": (d) => ({
		css: `@keyframes ris-zoom-out-in { from { transform:scale(0.94); opacity:0 } to { transform:scale(1); opacity:1 } }`,
		enterAnimation: `ris-zoom-out-in ${d}ms ease forwards`,
		duration: d,
	}),

	"slide-up": (d) => ({
		css: `@keyframes ris-slide-up { from { transform:translateY(6%); opacity:0 } to { transform:translateY(0); opacity:1 } }`,
		enterAnimation: `ris-slide-up ${d}ms cubic-bezier(.22,.68,0,1.2) forwards`,
		duration: d,
	}),

	"slide-down": (d) => ({
		css: `@keyframes ris-slide-down { from { transform:translateY(-6%); opacity:0 } to { transform:translateY(0); opacity:1 } }`,
		enterAnimation: `ris-slide-down ${d}ms cubic-bezier(.22,.68,0,1.2) forwards`,
		duration: d,
	}),

	"slide-left": (d) => ({
		css: `@keyframes ris-slide-left { from { transform:translateX(4%); opacity:0 } to { transform:translateX(0); opacity:1 } }`,
		enterAnimation: `ris-slide-left ${d}ms cubic-bezier(.22,.68,0,1.2) forwards`,
		duration: d,
	}),

	"slide-right": (d) => ({
		css: `@keyframes ris-slide-right { from { transform:translateX(-4%); opacity:0 } to { transform:translateX(0); opacity:1 } }`,
		enterAnimation: `ris-slide-right ${d}ms cubic-bezier(.22,.68,0,1.2) forwards`,
		duration: d,
	}),

	flip: (d) => ({
		css: `@keyframes ris-flip-in { from { transform:perspective(600px) rotateY(-15deg) scale(0.97); opacity:0 } to { transform:perspective(600px) rotateY(0) scale(1); opacity:1 } }`,
		enterAnimation: `ris-flip-in ${d}ms ease forwards`,
		duration: d,
	}),

	glitch: (d) => ({
		css: `
@keyframes ris-glitch {
  0%   { clip-path:inset(0 0 95% 0); transform:translateX(-4px); opacity:1 }
  10%  { clip-path:inset(30% 0 50% 0); transform:translateX(4px) }
  20%  { clip-path:inset(60% 0 20% 0); transform:translateX(-2px) }
  30%  { clip-path:inset(10% 0 70% 0); transform:translateX(3px) }
  40%  { clip-path:inset(80% 0 5% 0);  transform:translateX(-3px) }
  50%  { clip-path:inset(0 0 0 0);     transform:translateX(0); opacity:1 }
  100% { clip-path:inset(0 0 0 0);     transform:translateX(0); opacity:1 }
}`,
		enterAnimation: `ris-glitch ${d}ms steps(1) forwards`,
		duration: d,
	}),

	none: (_d) => ({
		css: "",
		enterAnimation: "",
		duration: 0,
	}),
};

export function resolveAnimation(
	anim: SwapAnimation = "fade",
	defaultDuration = D,
): ResolvedAnimation {
	if (typeof anim === "string") {
		return (PRESETS[anim] ?? PRESETS.fade)(defaultDuration);
	}
	const custom = anim as SwapAnimationCustom;
	return {
		css: "",
		enterAnimation: custom.enter,
		leaveAnimation: custom.leave,
		duration: custom.duration ?? defaultDuration,
	};
}
