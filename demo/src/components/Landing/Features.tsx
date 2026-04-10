const features = [
	{
		icon: "⌖",
		title: "Code-first API",
		desc: "Define spots in React — no JSON, no config files. Full TypeScript with autocomplete.",
		color: "text-blue-500",
	},
	{
		icon: "◈",
		title: "Render anything",
		desc: "Pass any React component as a spot. Tailwind, CSS modules, inline styles — your call.",
		color: "text-violet-500",
	},
	{
		icon: "⟳",
		title: "Responsive by default",
		desc: "Positions in % — spots scale perfectly with any image or container size.",
		color: "text-emerald-500",
	},
	{
		icon: "⊕",
		title: "Image swap",
		desc: "Add hoverSrc or activeSrc to any spot. 10 animation presets or bring your own keyframes.",
		color: "text-rose-500",
	},
	{
		icon: "⇆",
		title: "Scene Chain",
		desc: "Navigate between images with smooth transitions. Custom back button, full control.",
		color: "text-amber-500",
	},
	{
		icon: "◎",
		title: "Built-in editor",
		desc: 'Switch to mode="edit" — click image to get positions, auto-copied to clipboard.',
		color: "text-cyan-500",
	},
];

export const Features = () => (
	<section className='px-6 py-16 max-w-4xl mx-auto'>
		<div className='mb-12'>
			<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
				Everything you need
			</h2>
			<p className='text-slate-500 dark:text-white/40'>
				Zero runtime dependencies. TypeScript-first. Fully customizable.
			</p>
		</div>

		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
			{features.map((f) => (
				<div
					key={f.title}
					className='p-5 rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-white/3 hover:border-slate-300 dark:hover:bg-white/5 transition-all'>
					<div className={`text-xl mb-3 ${f.color}`}>{f.icon}</div>
					<h3 className='font-semibold text-slate-900 dark:text-white text-sm mb-1.5'>
						{f.title}
					</h3>
					<p className='text-slate-500 dark:text-white/40 text-sm leading-relaxed'>
						{f.desc}
					</p>
				</div>
			))}
		</div>
	</section>
);
