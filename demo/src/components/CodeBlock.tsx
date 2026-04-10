import { useState } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("tsx", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("bash", bash);

interface CodeBlockProps {
	code: string;
	language?: string;
}

export const CodeBlock = ({ code, language = "tsx" }: CodeBlockProps) => {
	const [copied, setCopied] = useState(false);

	const highlighted = (() => {
		try {
			return hljs.highlight(code, { language }).value;
		} catch {
			return code
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
		}
	})();

	const copy = () => {
		navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1800);
		});
	};

	return (
		<div className='rounded-xl overflow-hidden border border-slate-200 dark:border-white/8'>
			<div className='flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-white/8 bg-slate-100/50 dark:bg-white/3'>
				<span className='text-xs font-medium text-slate-400 dark:text-white/30 uppercase tracking-wider'>
					{language}
				</span>
				<button
					onClick={copy}
					className='text-xs text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/70 transition-colors cursor-pointer'>
					{copied ? "✓ Copied" : "Copy"}
				</button>
			</div>
			<pre className='p-5 overflow-x-auto text-sm leading-relaxed m-0 bg-slate-50 dark:bg-[#0d1117]'>
				<code
					className={`language-${language} font-mono`}
					dangerouslySetInnerHTML={{ __html: highlighted }}
				/>
			</pre>
		</div>
	);
};
