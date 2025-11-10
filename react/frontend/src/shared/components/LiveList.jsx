import React from 'react';

export default function LiveList({ items = [] }){
	return (
		<ul className="mt-3 space-y-2 max-h-56 overflow-auto fancy-scroll text-sm text-gray-700 dark:text-gray-200" role="log" aria-live="polite">
			{items.map(it => (
				<li key={it.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition">
					<div className="w-2.5 h-2.5 rounded-full bg-accent mt-1" />
					<div className="flex-1">
						<div className="text-xs text-gray-500 dark:text-gray-400">{new Date(it.time).toLocaleTimeString()}</div>
						<div className="text-sm">{it.text}</div>
					</div>
				</li>
			))}
			{items.length === 0 && <li className="text-xs text-gray-500">No recent events</li>}
		</ul>
	);
}
