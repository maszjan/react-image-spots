import { useState } from "react";

export function InstallBanner() {
	const [copied, setCopied] = useState(false);
	const cmd = "npm install react-image-spots";

	const copy = () => {
		navigator.clipboard.writeText(cmd).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		});
	};

	return (
		<section className='px-6 py-4 max-w-4xl mx-auto'>
			<button
				onClick={copy}
				className='w-full group flex items-center justify-between px-6 py-4 rounded-2xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3 hover:border-blue-200 dark:hover:border-white/15 hover:bg-blue-50/50 dark:hover:bg-white/5 transition-all cursor-pointer'>
				<div className='flex items-center gap-3 font-mono text-sm'>
					<span className='text-slate-400 dark:text-white/20'>$</span>
					<span className='text-slate-700 dark:text-white/70'>{cmd}</span>
				</div>
				<span className='text-xs text-slate-400 dark:text-white/30 group-hover:text-blue-500 dark:group-hover:text-white/60 transition-colors shrink-0 ml-4'>
					{copied ? "✓ Copied!" : "Click to copy"}
				</span>
			</button>
		</section>
	);
}
