import { type Route, navigate } from "../App";

interface NavProps {
	active: Route;
	theme: "light" | "dark";
	onThemeToggle: () => void;
}

const links: { route: Route; label: string }[] = [
	{ route: "docs", label: "Docs" },
];

export const Nav = ({ active, theme, onThemeToggle }: NavProps) => (
	<nav className='fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-xl transition-colors'>
		<div className='max-w-5xl mx-auto px-6 h-14 flex items-center justify-between'>
			<div className='flex flex-row justify-start space-x-2'>
				<button
					onClick={() => navigate("home")}
					className='flex items-center gap-2.5 shrink-0 cursor-pointer'>
					<span
						className={
							active === "home"
								? "text-sm text-slate-900 dark:text-white font-semibold"
								: "text-sm text-slate-900 dark:text-white font-normal"
						}>
						react-image-spots
					</span>
				</button>

				<div className='flex items-center gap-0.5'>
					{links.map(({ route, label }) => (
						<button
							key={route}
							onClick={() => navigate(route)}
							className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
								active === route
									? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
									: "text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
							}`}>
							{label}
						</button>
					))}
				</div>
			</div>

			<div className='flex items-center gap-1 shrink-0'>
				<button
					onClick={onThemeToggle}
					className='w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer'
					title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
					{theme === "dark" ? (
						<svg
							width='14'
							height='14'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'>
							<circle cx='12' cy='12' r='5' />
							<line x1='12' y1='1' x2='12' y2='3' />
							<line x1='12' y1='21' x2='12' y2='23' />
							<line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
							<line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
							<line x1='1' y1='12' x2='3' y2='12' />
							<line x1='21' y1='12' x2='23' y2='12' />
							<line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
							<line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
						</svg>
					) : (
						<svg
							width='14'
							height='14'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'>
							<path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
						</svg>
					)}
				</button>

				<a
					href='https://github.com/maszjan/react-image-spots'
					target='_blank'
					rel='noopener noreferrer'
					className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
						<path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
					</svg>
					GitHub
				</a>
			</div>
		</div>
	</nav>
);
