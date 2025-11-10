import { Outlet, NavLink } from 'react-router-dom';
import { PreferencesProvider } from '../context/PreferencesContext.jsx';
import { ToastProvider } from '../components/ToastProvider.jsx';

function Sidebar(){
  const link = 'flex items-center gap-3 px-3 py-2 rounded-xl glass hover:shadow-glow transition';
  const active = 'ring ring-white/30 bg-accent/10';
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 flex-col gap-6 p-6 pr-3 overflow-y-auto fancy-scroll big-scroll">
      <div className="glass rounded-2xl p-4 text-slate-800 dark:text-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-accent text-white flex items-center justify-center font-extrabold shadow-lg">IH</div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">IntelliHRTrack</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Command Center</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 mt-4" />
        <nav className="mt-3">
          <ul className="space-y-1">
            <li><NavLink to="/admin/dashboard" className={({isActive})=> isActive? `${link} ${active}`:link}>Dashboard</NavLink></li>
            <li><NavLink to="/admin/biometrics" className={({isActive})=> isActive? `${link} ${active}`:link}>BIOMETRICS & ATTENDANCE</NavLink></li>
            <li><NavLink to="/admin/employees" className={({isActive})=> isActive? `${link} ${active}`:link}>EMPLOYEE MANAGEMENT</NavLink></li>
            <li><NavLink to="/admin/schedule" className={({isActive})=> isActive? `${link} ${active}`:link}>SCHEDULING & SHIFTS</NavLink></li>
            <li><NavLink to="/admin/leave" className={({isActive})=> isActive? `${link} ${active}`:link}>LEAVE & ABSENCES</NavLink></li>
            <li><NavLink to="/admin/payroll" className={({isActive})=> isActive? `${link} ${active}`:link}>PAYROLL & FINANCE</NavLink></li>
            <li><NavLink to="/admin/ai" className={({isActive})=> isActive? `${link} ${active}`:link}>AI & WORKFORCE ANALYTICS</NavLink></li>
            <li><NavLink to="/admin/reports" className={({isActive})=> isActive? `${link} ${active}`:link}>REPORTS & EXPORTS</NavLink></li>
            <li><NavLink to="/admin/system" className={({isActive})=> isActive? `${link} ${active}`:link}>SYSTEM ADMINISTRATION</NavLink></li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default function AdminLayout(){
  return (
    <PreferencesProvider>
      <ToastProvider>
        <div className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 lg:ml-72">
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    </PreferencesProvider>
  );
}
