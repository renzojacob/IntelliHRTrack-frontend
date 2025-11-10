import { useEffect, useMemo, useState } from 'react';
import StatCard from '../../shared/components/StatCard.jsx';
import LiveList from '../../shared/components/LiveList.jsx';
import { useToast } from '../../shared/components/ToastProvider.jsx';

const initialStats = [
  { id: 'present', title: 'Present', value: 126, delta: '+3' },
  { id: 'late', title: 'Late', value: 8, delta: '+1' },
  { id: 'onleave', title: 'On Leave', value: 12, delta: '-1' },
  { id: 'absent', title: 'Absent', value: 4, delta: '+0' },
];

export default function AdminDashboard(){
  const [stats] = useState(initialStats);
  const [live, setLive] = useState(() => [
    { id: 1, time: new Date(), text: 'John D. checked in (face)' },
    { id: 2, time: new Date(Date.now()-1000*60*2), text: 'Maria K. checked out (fingerprint)' },
  ]);
  const [clock, setClock] = useState('--:--:--');
  const { showToast } = useToast();

  useEffect(()=>{
    const t = setInterval(()=> setClock(new Date().toLocaleTimeString()), 1000);
    return ()=> clearInterval(t);
  },[]);

  // simulate incoming live events every 8s
  useEffect(()=>{
    const ids = [ 'Alice', 'Bob', 'Carlos', 'Diana' ];
    const i = setInterval(()=>{
      const who = ids[Math.floor(Math.random()*ids.length)];
      const ev = { id: Date.now(), time: new Date(), text: `${who} checked in (auto)` };
      setLive(prev => [ev, ...prev].slice(0,12));
    }, 8000);
    return ()=> clearInterval(i);
  },[]);

  const statsGrid = useMemo(()=> (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(s=> (<StatCard key={s.id} title={s.title} value={s.value} delta={s.delta} />))}
    </div>
  ),[stats]);

  return (
    <section className="space-y-6">
      <header className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-glow">
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Dashboard — Real-Time Workforce Overview</h2>
            <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">Intelligent visualization, predictive analytics, and operational control.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl glass text-xs">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" title="Online"></span>
              <span className="text-xs font-mono">{clock}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Welcome, Admin</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-semibold">A</div>
          </div>
        </div>
      </header>

      {statsGrid}

      <div className="glass rounded-3xl p-4 md:p-6 shadow grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-semibold flex items-center gap-2">Live Attendance Feed</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Streaming last events • Updated: now</p>
          <LiveList items={live} />
        </div>
        <div className="lg:border-l lg:pl-6">
          <h3 className="font-semibold flex items-center gap-2">Quick Actions</h3>
          <div className="mt-3 grid gap-2">
            <button onClick={()=> showToast('Payroll generation started', { type:'info' })} className="w-full py-2 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-glow transition">Generate Payroll</button>
            <button onClick={()=> showToast('Leaves approved', { type:'success' })} className="w-full py-2 rounded-xl glass hover:shadow-glow transition">Approve Leaves</button>
            <button onClick={()=> showToast('Open registration form (demo)', { type:'info' })} className="w-full py-2 rounded-xl glass hover:shadow-glow transition">Register Employee</button>
            <button onClick={()=> showToast('Exported audit snapshot', { type:'info' })} className="w-full py-2 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-white/40">Export Audit Snapshot</button>
            <button onClick={()=> showToast('Anomaly scan queued', { type:'warning' })} className="w-full py-2 rounded-xl bg-rose-500 text-white">Run Anomaly Scan</button>
          </div>
        </div>
      </div>

      <footer className="pb-8 pt-2 text-xs text-gray-500 dark:text-gray-400 text-center">© IntelliHRTrack • Demonstration build — integrate with backend for production.</footer>
    </section>
  );
}
