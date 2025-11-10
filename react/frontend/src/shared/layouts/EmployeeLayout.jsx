import { Outlet, NavLink } from 'react-router-dom';
import { PreferencesProvider } from '../context/PreferencesContext.jsx';
import { ToastProvider } from '../components/ToastProvider.jsx';

function Sidebar(){
  const link = 'flex items-center gap-3 px-3 py-2 rounded-xl glass hover:shadow-glow transition';
  const active = 'ring ring-white/30 bg-accent/10';
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col gap-6 p-6 pr-3 overflow-y-auto fancy-scroll big-scroll">
      <div className="glass rounded-2xl p-4 text-slate-800 dark:text-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-accent text-white flex items-center justify-center font-extrabold shadow-lg">IH</div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">IntelliHRTrack</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Employee Portal</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 mt-4" />
        <nav className="mt-3">
          <ul className="space-y-1 text-sm">
            <li><NavLink to="/employee/dashboard" className={({isActive})=> isActive? `${link} ${active}`:link}>Dashboard</NavLink></li>
            <li><NavLink to="/employee/attendance" className={({isActive})=> isActive? `${link} ${active}`:link}>Attendance</NavLink></li>
            <li><NavLink to="/employee/analytics" className={({isActive})=> isActive? `${link} ${active}`:link}>Analytics</NavLink></li>
            <li><NavLink to="/employee/leave" className={({isActive})=> isActive? `${link} ${active}`:link}>Leave</NavLink></li>
            <li><NavLink to="/employee/notifications" className={({isActive})=> isActive? `${link} ${active}`:link}>Notifications</NavLink></li>
            <li><NavLink to="/employee/payroll" className={({isActive})=> isActive? `${link} ${active}`:link}>Payroll</NavLink></li>
            <li><NavLink to="/employee/schedule" className={({isActive})=> isActive? `${link} ${active}`:link}>Schedule</NavLink></li>
            <li><NavLink to="/employee/user" className={({isActive})=> isActive? `${link} ${active}`:link}>Profile</NavLink></li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default function EmployeeLayout(){
  return (
    <PreferencesProvider>
      <ToastProvider>
        <div className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 lg:ml-64">
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    </PreferencesProvider>
  );
}
