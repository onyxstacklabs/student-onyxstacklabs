'use client';

import React, { useState, useEffect } from 'react';
import { SaaSUserProfile, UserAccountStatus, searchUsers, updateUserStatus } from '@/lib/user/userService';
import { Users, Search, Shield, UserCheck, UserX, Clock, Building, Sparkles } from 'lucide-react';

export function UserManagementCard() {
  const [users, setUsers] = useState<SaaSUserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    setUsers(searchUsers(searchQuery, roleFilter));
  }, [searchQuery, roleFilter]);

  const handleToggleStatus = (userId: string, currentStatus: UserAccountStatus) => {
    const nextStatus: UserAccountStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const updated = updateUserStatus(userId, nextStatus);
    if (updated) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-200 shadow-xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Cross-Tenant User Directory</h2>
            <p className="text-xs text-slate-400">Manage user identities, access roles, and account statuses</p>
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="institution_admin">Institution Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-2">User Profile</th>
              <th className="pb-3 px-2">Role & Tenant</th>
              <th className="pb-3 px-2">Tier</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2">Last Active</th>
              <th className="pb-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No users matching the filter criteria.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                  {/* User Profile */}
                  <td className="py-3 px-2">
                    <div className="font-semibold text-white">{u.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </td>

                  {/* Role & Tenant */}
                  <td className="py-3 px-2 space-y-0.5">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-indigo-300 capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                    {u.tenantName && (
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Building className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[140px]">{u.tenantName}</span>
                      </div>
                    )}
                  </td>

                  {/* Tier */}
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {u.tier}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-2">
                    {u.status === 'active' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <UserCheck className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                    {u.status === 'suspended' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <UserX className="w-3 h-3" />
                        <span>Suspended</span>
                      </span>
                    )}
                    {u.status === 'pending_verification' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>

                  {/* Last Active */}
                  <td className="py-3 px-2 text-slate-400 font-mono text-[11px]">
                    {new Date(u.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                        u.status === 'active'
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
