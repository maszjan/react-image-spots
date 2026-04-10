import type { ReactNode } from "react";
import { CodeBlock } from "../CodeBlock";

interface DocSectionProps {
	id: string;
	title: string;
	description?: ReactNode;
	code?: string;
	language?: string;
	children?: ReactNode;
	cta?: { label: string; onClick: () => void };
}

export const DocSection = ({
	id,
	title,
	description,
	code,
	language,
	children,
	cta,
}: DocSectionProps) => (
	<section id={id} className='mb-14 scroll-mt-24'>
		<h2 className='text-xl font-bold text-slate-900 dark:text-white mb-3'>
			{title}
		</h2>
		{description && (
			<div className='text-slate-500 dark:text-white/50 text-sm mb-4 leading-relaxed'>
				{description}
			</div>
		)}
		{code && <CodeBlock code={code} language={language} />}
		{children}
		{cta && (
			<button
				onClick={cta.onClick}
				className='mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer'>
				{cta.label} →
			</button>
		)}
	</section>
);
