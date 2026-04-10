import { navigate } from "../App";

export const Footer = () => (
	<footer className='border-t border-slate-100 dark:border-white/5 mt-8'>
		<div className='max-w-4xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6'>
			{/* Logo + tagline */}
			<div className='flex flex-col items-center sm:items-start gap-1.5'>
				<button
					onClick={() => navigate("home")}
					className='flex items-center gap-2 cursor-pointer'>
					<span className='font-semibold text-sm text-slate-900 dark:text-white'>
						react-image-spots
					</span>
				</button>
				<p className='text-xs text-slate-400 dark:text-white/25'>
					Interactive hotspots for React. MIT License.
				</p>
			</div>

			{/* Links */}
			<div className='flex items-center gap-6'>
				<button
					onClick={() => navigate("docs")}
					className='text-sm text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/70 transition-colors cursor-pointer'>
					Docs
				</button>
				<a
					href='https://github.com/maszjan/react-image-spots'
					target='_blank'
					rel='noopener noreferrer'
					className='text-sm text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/70 transition-colors'>
					GitHub
				</a>
				<a
					href='https://www.npmjs.com/package/react-image-spots'
					target='_blank'
					rel='noopener noreferrer'
					className='text-sm text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/70 transition-colors'>
					npm
				</a>
			</div>

			{/* Version */}
			<div className='text-xs text-slate-300 dark:text-white/15 font-mono'>
				v{__APP_VERSION__}
			</div>
		</div>
	</footer>
);
