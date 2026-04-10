interface Prop {
	name: string;
	type: string;
	desc: string;
	required?: boolean;
}

interface ApiTableProps {
	componentName: string;
	props: Prop[];
}

export const ApiTable = ({ componentName, props }: ApiTableProps) => (
	<div className='mb-8'>
		<h3 className='text-base font-semibold text-slate-700 dark:text-white/80 mb-3'>
			<code className='text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded text-sm'>
				{componentName}
			</code>
		</h3>
		<div className='rounded-xl border border-slate-200 dark:border-white/8 overflow-hidden'>
			<table className='w-full text-sm'>
				<thead>
					<tr className='border-b border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3'>
						<th className='text-left px-4 py-2.5 text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-wider'>
							Prop
						</th>
						<th className='text-left px-4 py-2.5 text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-wider'>
							Type
						</th>
						<th className='text-left px-4 py-2.5 text-slate-500 dark:text-white/40 font-medium text-xs uppercase tracking-wider'>
							Description
						</th>
					</tr>
				</thead>
				<tbody>
					{props.map((prop, i) => (
						<tr
							key={prop.name}
							className={
								i < props.length - 1
									? "border-b border-slate-100 dark:border-white/5"
									: ""
							}>
							<td className='px-4 py-3'>
								<code className='text-blue-600 dark:text-blue-300 text-xs font-mono'>
									{prop.name}
								</code>
								{prop.required && (
									<span className='ml-1.5 text-[10px] text-rose-500 font-medium'>
										required
									</span>
								)}
							</td>
							<td className='px-4 py-3'>
								<code className='text-slate-500 dark:text-white/30 text-xs font-mono'>
									{prop.type}
								</code>
							</td>
							<td className='px-4 py-3 text-slate-500 dark:text-white/40 text-xs leading-relaxed'>
								{prop.desc}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</div>
);
