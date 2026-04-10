import TerminalAnimation from "./TerminalAnimation";
import { Examples } from "./Examples";

export const Hero = () => {
	return (
		<section className='relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden'>
			{/* Background glows */}
			<div className='absolute inset-0 pointer-events-none overflow-hidden'>
				<div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-blue-500/5 dark:bg-blue-600/8 blur-[100px]' />
				<div className='absolute bottom-1/4 left-1/4 w-75 h-75 rounded-full bg-indigo-500/5 dark:bg-indigo-600/6 blur-[80px]' />
			</div>

			{/* Badge */}
			<div className='relative mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-slate-500 dark:text-white/50 shadow-sm'>
				<div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
				v0.1.0 — Now available on npm
			</div>

			{/* Title */}
			<h1 className='relative text-center font-bold tracking-tight mb-5'>
				<span className='block text-5xl md:text-7xl text-slate-900 dark:text-white leading-[1.05] mb-1'>
					Interactive
				</span>
				<span
					className='block text-5xl md:text-7xl leading-[1.05] mb-4'
					style={{
						background: "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}>
					image spots
				</span>
			</h1>

			<p className='relative text-center text-lg text-slate-500 dark:text-white/40 max-w-lg mb-8 leading-relaxed'>
				A React package for placing interactive hotspots on images. Define spots
				in code, render anything, navigate between scenes with animations
			</p>

			<div className='w-full max-w-3xl min-w-0 mb-12'>
				<TerminalAnimation />
			</div>

			<div className='relative w-full'>
				<Examples />
			</div>
		</section>
	);
};
