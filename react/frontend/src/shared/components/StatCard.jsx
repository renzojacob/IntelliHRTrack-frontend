import React from 'react';

export default function StatCard({ title, value, delta }){
	const deltaClass = delta && delta.toString().startsWith('-') ? 'text-rose-500' : 'text-green-500';
	return (
		<div className="glass rounded-2xl p-4 shadow hover:shadow-glow transition hover-lift">
			<div className="text-xs text-gray-500 dark:text-gray-400">{title}</div>
			<div className="mt-1 text-3xl font-extrabold">{value}</div>
			{delta ? <div className={`text-sm ${deltaClass}`}>{delta}</div> : null}
		</div>
	);
}
