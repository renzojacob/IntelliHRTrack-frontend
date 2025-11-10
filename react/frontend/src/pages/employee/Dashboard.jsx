export default function EmpDashboard(){
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight">My Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Personal overview and quick actions.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="glass rounded-2xl p-4 h-40">Placeholder: My Attendance</div>
        <div className="glass rounded-2xl p-4 h-40">Placeholder: Upcoming Shifts</div>
        <div className="glass rounded-2xl p-4 h-40">Placeholder: Leave Balance</div>
      </div>
    </section>
  );
}
