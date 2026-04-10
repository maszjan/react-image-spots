import { describe, it, expect } from "vitest";
import { resolveAnimation } from "../components/swapAnimations";

describe("resolveAnimation — presets", () => {
	it("fade: has animation and correct duration", () => {
		const r = resolveAnimation("fade", 400);
		expect(r.enterAnimation).toBeTruthy();
		expect(r.enterAnimation).toContain("400ms");
		expect(r.duration).toBe(400);
	});

	it("none: empty animation, duration 0", () => {
		const r = resolveAnimation("none", 400);
		expect(r.enterAnimation).toBe("");
		expect(r.duration).toBe(0);
	});

	it("blur: has both enter and leave keyframes", () => {
		const r = resolveAnimation("blur", 400);
		expect(r.enterAnimation).toContain("ris-blur-in");
		expect(r.leaveAnimation).toContain("ris-blur-out");
		expect(r.css).toContain("@keyframes ris-blur-in");
		expect(r.css).toContain("@keyframes ris-blur-out");
		expect(r.duration).toBe(400);
	});

	it("zoom: has enter keyframe, no leave", () => {
		const r = resolveAnimation("zoom", 300);
		expect(r.enterAnimation).toContain("ris-zoom-in");
		expect(r.leaveAnimation).toBeUndefined();
		expect(r.duration).toBe(300);
	});

	it("zoom-out: separate keyframe name from zoom", () => {
		const r = resolveAnimation("zoom-out", 400);
		expect(r.enterAnimation).toContain("ris-zoom-out-in");
		expect(r.css).toContain("@keyframes ris-zoom-out-in");
	});

	it("slide variants: use cubic-bezier easing", () => {
		for (const preset of [
			"slide-up",
			"slide-down",
			"slide-left",
			"slide-right",
		] as const) {
			const r = resolveAnimation(preset, 400);
			expect(r.enterAnimation).toContain("cubic-bezier");
			expect(r.css.length).toBeGreaterThan(0);
		}
	});

	it("flip: uses perspective in keyframes", () => {
		const r = resolveAnimation("flip", 400);
		expect(r.enterAnimation).toContain("ris-flip-in");
		expect(r.css).toContain("perspective");
	});

	it("glitch: uses steps timing and clip-path", () => {
		const r = resolveAnimation("glitch", 400);
		expect(r.enterAnimation).toContain("steps(1)");
		expect(r.css).toContain("clip-path");
	});

	it("respects custom duration for all non-none presets", () => {
		const presets = [
			"fade",
			"blur",
			"zoom",
			"zoom-out",
			"slide-up",
			"slide-down",
			"slide-left",
			"slide-right",
			"flip",
			"glitch",
		] as const;
		for (const preset of presets) {
			const r = resolveAnimation(preset, 999);
			expect(r.duration).toBe(999);
			expect(r.enterAnimation).toContain("999ms");
		}
	});

	it("unknown preset falls back to fade behavior", () => {
		const r = resolveAnimation("unknown" as any, 400);
		expect(r.enterAnimation).toBeTruthy();
		expect(r.duration).toBe(400);
	});

	it("default anim works when called with no args", () => {
		const r = resolveAnimation();
		expect(r.enterAnimation).toBeTruthy();
		expect(r.duration).toBe(400);
	});
});

describe("resolveAnimation — custom object", () => {
	it("passes through enter and leave", () => {
		const r = resolveAnimation(
			{
				enter: "my-in 400ms ease forwards",
				leave: "my-out 400ms ease forwards",
				duration: 400,
			},
			300,
		);
		expect(r.enterAnimation).toBe("my-in 400ms ease forwards");
		expect(r.leaveAnimation).toBe("my-out 400ms ease forwards");
		expect(r.duration).toBe(400);
	});

	it("uses defaultDuration when duration not provided", () => {
		const r = resolveAnimation({ enter: "my-in 300ms ease forwards" }, 300);
		expect(r.duration).toBe(300);
	});

	it("custom object always has empty css", () => {
		const r = resolveAnimation(
			{ enter: "my-in 400ms ease forwards", duration: 400 },
			400,
		);
		expect(r.css).toBe("");
	});

	it("leave is undefined when not set", () => {
		const r = resolveAnimation({ enter: "my-in 400ms ease forwards" }, 400);
		expect(r.leaveAnimation).toBeUndefined();
	});
});
