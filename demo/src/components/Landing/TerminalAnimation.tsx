import { useState, useEffect, useRef } from "react";

const CMD = "npm install react-image-spots";

const TerminalAnimation = () => {
	const [displayed, setDisplayed] = useState("");
	const [phase, setPhase] = useState<"typing" | "installing" | "finished">(
		"typing",
	);
	const activeRef = useRef(true);

	const runCycle = () => {
		let i = 0;
		setDisplayed("");
		setPhase("typing");

		const timer = setInterval(() => {
			if (!activeRef.current) {
				clearInterval(timer);
				return;
			}
			i++;
			setDisplayed(CMD.slice(0, i));
			if (i >= CMD.length) {
				clearInterval(timer);
				setTimeout(() => activeRef.current && setPhase("installing"), 700);
				setTimeout(() => activeRef.current && setPhase("finished"), 1800);
			}
		}, 60);

		return timer;
	};

	useEffect(() => {
		activeRef.current = true;
		const timer = runCycle();
		return () => {
			activeRef.current = false;
			clearInterval(timer);
		};
	}, []);

	return (
		<div className='w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-950 shadow-lg font-mono text-sm'>
			<div className='flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-slate-900'>
				<div className='w-3 h-3 rounded-full bg-red-500/70' />
				<div className='w-3 h-3 rounded-full bg-amber-500/70' />
				<div className='w-3 h-3 rounded-full bg-emerald-500/70' />
				<span className='ml-2 text-xs text-white/20'>terminal</span>
			</div>
			<div className='p-4 h-24'>
				<div className='flex items-center gap-2 overflow-hidden'>
					<span className='text-emerald-400 shrink-0'>~</span>
					<span className='text-white/30 shrink-0'>$</span>
					<span className='text-white/90 truncate'>
						{displayed}
						{phase === "typing" && (
							<span className='inline-block w-0.5 h-3.5 bg-white/70 ml-0.5 animate-pulse align-middle' />
						)}
					</span>
				</div>
				{phase === "installing" && (
					<div className='mt-2'>
						<div className='text-white/40 text-xs'>added 1 package in 0.8s</div>
					</div>
				)}
				{phase === "finished" && (
					<div className='mt-2 space-y-1'>
						<div className='text-white/40 text-xs'>added 1 package in 0.8s</div>
						<div className='flex items-center gap-1.5 text-xs'>
							<span className='text-emerald-400'>✓</span>
							<span className='text-white/60'>react-image-spots ready</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TerminalAnimation;
