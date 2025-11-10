import { useState } from 'react';
import ProfilePanel from './employees/ProfilePanel.jsx';

const sample = [
  { id: 1, name: 'John Doe', role: 'Sales', email: 'john.doe@example.com' },
  { id: 2, name: 'Maria Keller', role: 'HR', email: 'maria.k@example.com' },
  { id: 3, name: 'Ahmed Ali', role: 'Engineering', email: 'ahmed.ali@example.com' },
];

export default function AdminEmployees(){
  const [items] = useState(sample);
  const [selected, setSelected] = useState(null);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight">Employee Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Create, update, and manage employee records and roles.</p>
      </header>

      <div className="glass rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                  <td className="py-3 px-3">{u.name}</td>
                  <td className="py-3 px-3">{u.role}</td>
                  <td className="py-3 px-3">{u.email}</td>
                  <td className="py-3 px-3">
                    <button onClick={()=> setSelected(u)} className="px-3 py-1 rounded-lg glass text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <ProfilePanel employee={selected} onClose={()=> setSelected(null)} />}
    </section>
  );
}
