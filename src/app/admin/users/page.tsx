'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/app-state-context';
import { useRole } from '@/context/role-context';
import { UserRole } from '@/types';
import { ShieldAlert, Trash2, Plus, Mail, User as UserIcon } from 'lucide-react';

export default function UserManagementPage() {
  const { currentRole } = useRole();
  const { users, addUser, deleteUser } = useAppState();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Staff');

  if (currentRole !== 'Admin') {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center">
        <ShieldAlert className="mb-4 h-16 w-16 text-red-500/80" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-black/60 dark:text-white/60">
          You do not have permission to view this page. Please log in as an Administrator.
        </p>
      </div>
    );
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      avatar: '',
      department: 'General',
      capacity: 100,
      teamId: 'all'
    });

    setNewName('');
    setNewEmail('');
    setNewRole('Staff');
    setIsAdding(false);
  };

  return (
    <div className="px-10 py-8 pb-24">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-[36px] font-outfit font-bold tracking-tight text-[var(--color-apple-text)]">User Management</h1>
          <p className="text-[14px] text-[var(--color-apple-subtle)] mt-1">
            Manage roles and access for the UEF Marcom workspace
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-full bg-[var(--accent-purple)] px-5 py-2.5 text-[14px] font-medium text-white shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {isAdding && (
        <section className="apple-card mb-8 p-6 animated-gradient-bg !from-white/40 !to-white/10 dark:!from-black/40 dark:!to-black/10">
          <h3 className="mb-4 text-lg font-semibold">Add New User</h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold tracking-wider text-black/60 dark:text-white/60">NAME</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 dark:text-white/40" />
                <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full rounded-xl bg-white/50 dark:bg-black/40 border border-white/40 dark:border-white/10 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent-purple)]"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold tracking-wider text-black/60 dark:text-white/60">EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 dark:text-white/40" />
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/50 dark:bg-black/40 border border-white/40 dark:border-white/10 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent-purple)]"
                  placeholder="john@uef.edu.vn"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold tracking-wider text-black/60 dark:text-white/60">ROLE</label>
              <select 
                value={newRole} 
                onChange={e => setNewRole(e.target.value as UserRole)}
                className="w-full rounded-xl bg-white/50 dark:bg-black/40 border border-white/40 dark:border-white/10 py-2.5 px-4 text-sm outline-none focus:border-[var(--accent-purple)] appearance-none"
              >
                <option value="Staff">Staff</option>
                <option value="Leader">Leader</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <button type="submit" className="w-full rounded-xl bg-black dark:bg-white py-2.5 text-sm font-semibold text-white dark:text-black">
                Create User
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="apple-card overflow-hidden border-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5">
            <tr>
              <th className="px-6 py-4 font-semibold text-black/70 dark:text-white/70">Name</th>
              <th className="px-6 py-4 font-semibold text-black/70 dark:text-white/70">Email</th>
              <th className="px-6 py-4 font-semibold text-black/70 dark:text-white/70">Role</th>
              <th className="px-6 py-4 font-semibold text-black/70 dark:text-white/70">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {users.map(user => (
              <tr key={user.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  {user.name}
                </td>
                <td className="px-6 py-4 text-black/60 dark:text-white/60">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    user.role === 'Admin' ? 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400' :
                    user.role === 'Manager' ? 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400' :
                    user.role === 'Leader' ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400' :
                    'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => deleteUser(user.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
