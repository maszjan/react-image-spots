import { navigate } from "../../App";

interface SidebarProps {
	activeSection: string;
	onSectionClick: (id: string) => void;
}

export const DOC_SECTIONS = [
	{ id: "install", label: "Installation" },
	{ id: "editor", label: "Spot Editor" },
	{ id: "map", label: "Image Spot Map" },
	{ id: "swap", label: "Image Swap" },
	{ id: "animations", label: "Animations" },
	{ id: "chain", label: "Scene Chain" },
	{ id: "api", label: "API Reference" },
];

export const Sidebar = ({ activeSection, onSectionClick }: SidebarProps) => (
	<aside className='hidden lg:block w-52 shrink-0'>
		<div className='sticky top-24'>
			<p className='text-xs font-semibold text-slate-400 dark:text-white/20 uppercase tracking-wider mb-3'>
				On this page
			</p>
			<nav className='flex flex-col gap-0.5 mb-8'>
				{DOC_SECTIONS.map((s) => (
					<button
						key={s.id}
						onClick={() => onSectionClick(s.id)}
						className={`text-left text-sm py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
							activeSection === s.id
								? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-medium"
								: "text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/80"
						}`}>
						{s.label}
					</button>
				))}
			</nav>

			<div className='pt-6 border-t border-slate-100 dark:border-white/8'>
				<p className='text-xs font-semibold text-slate-400 dark:text-white/20 uppercase tracking-wider mb-3'>
					Examples
				</p>
				<div className='flex flex-col gap-0.5'>
					{[
						{ route: "home" as const, label: "Edit Mode", sectionId: "editor" },
						{ route: "home" as const, label: "Spot Map", sectionId: "map" },
						{
							route: "home" as const,
							label: "Scene Chain",
							sectionId: "chain",
						},
					].map(({ route, label, sectionId }) => (
						<button
							key={label}
							onClick={() => navigate(route, sectionId)}
							className='text-left text-sm py-1.5 px-2 rounded-lg text-blue-500 dark:text-blue-400/70 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all cursor-pointer'>
							{label} →
						</button>
					))}
				</div>
			</div>
		</div>
	</aside>
);
