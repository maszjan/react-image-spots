import { useState } from "react";
import { ImageSpotMap } from "react-image-spots";
import type { SwapAnimationPreset, SpotDef } from "react-image-spots";

const PRESETS: { id: SwapAnimationPreset; label: string; desc: string }[] = [
	{ id: "fade", label: "Fade", desc: "Smooth crossfade" },
	{ id: "blur", label: "Blur", desc: "Blur in & out" },
	{ id: "zoom", label: "Zoom", desc: "Scale up on enter" },
	{ id: "zoom-out", label: "Zoom Out", desc: "Scale down on enter" },
	{ id: "slide-up", label: "Slide Up", desc: "Slides from below" },
	{ id: "slide-down", label: "Slide Down", desc: "Slides from above" },
	{ id: "slide-left", label: "Slide Left", desc: "Slides from right" },
	{ id: "slide-right", label: "Slide Right", desc: "Slides from left" },
	{ id: "flip", label: "Flip", desc: "3D perspective flip" },
	{ id: "glitch", label: "Glitch", desc: "Cyberpunk glitch" },
	{ id: "none", label: "None", desc: "Instant swap" },
];

const IMAGE_A = "https://picsum.photos/id/1040/800/450";
const IMAGE_B = "https://picsum.photos/id/29/800/450";

export const AnimationsShowcase = () => {
	const [active, setActive] = useState<SwapAnimationPreset>("fade");

	const spot: SpotDef = {
		id: "demo",
		position: { x: 50, y: 50 },
		size: { w: 100, h: 100 },
		hoverSrc: IMAGE_B,
		swapAnimation: active,
		render: ({ onMouseEnter, onMouseLeave }) => (
			<div
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				style={{ width: "100%", height: "100%", cursor: "crosshair" }}
			/>
		),
	};

	return (
		<section className='px-6 py-16 max-w-4xl mx-auto'>
			<div className='mb-10'>
				<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
					Swap Animations
				</h2>
				<p className='text-slate-500 dark:text-white/40'>
					10 built-in presets. Pick one, hover the image to preview.
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
				{/* Preview */}
				<div className='rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm'>
					<div className='aspect-video'>
						<ImageSpotMap src={IMAGE_A} spots={[spot]} swapAnimation={active} />
					</div>
					<div className='px-4 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between'>
						<span className='text-xs font-mono font-bold text-blue-600 dark:text-blue-400'>
							swapAnimation="{active}"
						</span>
						<span className='text-xs text-slate-400 dark:text-white/30'>
							hover image ↑
						</span>
					</div>
				</div>

				{/* Presets grid */}
				<div className='grid grid-cols-3 gap-2'>
					{PRESETS.map((p) => (
						<button
							key={p.id}
							onClick={() => setActive(p.id)}
							className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
								active === p.id
									? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10"
									: "border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/15 bg-white dark:bg-white/3"
							}`}>
							<div
								className={`text-xs font-bold mb-0.5 ${
									active === p.id
										? "text-blue-600 dark:text-blue-400"
										: "text-slate-700 dark:text-white/80"
								}`}>
								{p.label}
							</div>
							<div className='text-[10px] text-slate-400 dark:text-white/30 leading-tight'>
								{p.desc}
							</div>
						</button>
					))}

					{/* Custom animation hint */}
					<div className='col-span-3 mt-1 p-3 rounded-xl border border-dashed border-slate-200 dark:border-white/10'>
						<div className='text-xs font-bold text-slate-500 dark:text-white/40 mb-1'>
							+ Custom
						</div>
						<code className='text-[10px] text-slate-400 dark:text-white/25 leading-relaxed block font-mono'>
							{"{ enter: 'my-anim 400ms ease' }"}
						</code>
					</div>
				</div>
			</div>
		</section>
	);
};
