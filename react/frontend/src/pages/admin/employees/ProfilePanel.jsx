import React from 'react';

export default function ProfilePanel({ employee, onClose }){
  if(!employee) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{employee.name}</h3>
            <div className="text-sm text-gray-500">{employee.role}</div>
          </div>
          <div>
            <button onClick={onClose} className="px-3 py-1 rounded-lg glass">Close</button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">Email</div>
            <div className="font-medium">{employee.email}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Employee ID</div>
            <div className="font-medium">{employee.id}</div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold">Actions</h4>
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 rounded-xl glass">Edit</button>
            <button className="px-3 py-2 rounded-xl bg-rose-500 text-white">Deactivate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
