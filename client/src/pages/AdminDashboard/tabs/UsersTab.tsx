import React, { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { apiClient } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';

interface UsersTabProps {
  addLog: (message: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ addLog }) => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await apiClient.get(`/admin/users?page=${userPage}&limit=10&search=${encodeURIComponent(userSearch)}&role=${userRoleFilter}`);
      setUsersList(data.users);
      setUserTotalPages(data.pagination.totalPages);
      addLog(`[Audit] Loaded users list (Page ${userPage}). Total count: ${data.pagination.total}.`);
    } catch (err) {
      console.error('Failed to fetch users', err);
      addLog(`[Error] Failed to load users.`);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userPage, userSearch, userRoleFilter]);

  const changeUserRole = async (userId: string, email: string, newRole: string) => {
    try {
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      addLog(`[Audit] Changed user role for ${email} to ${newRole}.`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to change user role');
      addLog(`[Error] Failed to change user role for ${email}.`);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}? All their business listings, reviews, and activities will be removed.`)) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsersList(prev => prev.filter(u => u.id !== userId));
      addLog(`[Audit] Deleted user account ${email}.`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete user');
      addLog(`[Error] Failed to delete user ${email}.`);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">User Accounts Directory</h1>
        <p className="text-xs text-slate-500 mt-1">Manage user registrations, modify privileges, or ban user accounts permanently.</p>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/50 border border-slate-200 rounded-none">
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Search Users (Name/Email/Phone)</label>
          <input
            type="text"
            value={userSearch}
            onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
            placeholder="Search name, email, phone..."
            className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Filter User Role</label>
          <div className="relative">
            <select
              value={userRoleFilter}
              onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(1); }}
              className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold appearance-none bg-white pr-8"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">CUSTOMER (Clients)</option>
              <option value="OWNER">OWNER (Dealers)</option>
              <option value="ADMIN">ADMIN (Administrators)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {usersLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="rounded-none glass-panel border border-slate-200 overflow-hidden bg-white shadow-glass-sm animate-in fade-in-50 duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/65 border-b border-slate-150 text-slate-655 uppercase tracking-wider font-bold">
                  <th className="p-3.5">User Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Active Role</th>
                  <th className="p-3.5">Plan / Stats</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {usersList.length > 0 ? (
                  usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{usr.name}</td>
                      <td className="p-3.5 font-medium">{usr.email}</td>
                      <td className="p-3.5 text-slate-500">{usr.phone || 'N/A'}</td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-1.5">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-wider border ${
                            usr.role === 'ADMIN'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
                              : usr.role === 'OWNER'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                              : 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                          }`}>
                            {usr.role === 'OWNER' ? 'SELLER/OWNER' : usr.role}
                          </span>
                          <select
                            value={usr.role}
                            disabled={usr.id === user?.id} // Don't allow changing self
                            onChange={(e) => changeUserRole(usr.id, usr.email, e.target.value)}
                            className="rounded-none border border-slate-250 px-1 py-0.5 text-[10px] font-extrabold bg-slate-50 uppercase cursor-pointer focus:outline-none"
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="OWNER">Owner</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-3.5 text-[10px] space-y-0.5">
                        <div className="font-bold text-slate-600">Plan: {usr.plan}</div>
                        <div className="text-slate-500">Listings: {usr.businesses?.length || 0}</div>
                        <div className="text-slate-500">Reviews: {usr.reviewsCount || 0}</div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          disabled={usr.id === user?.id}
                          onClick={() => deleteUser(usr.id, usr.email)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No users match your current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {userTotalPages > 1 && (
            <div className="flex items-center justify-between p-3.5 border-t border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Page {userPage} of {userTotalPages}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setUserPage(prev => Math.max(prev - 1, 1))}
                  disabled={userPage === 1}
                  className="px-2.5 py-1 border border-slate-200 rounded text-xs font-bold bg-white text-slate-600 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setUserPage(prev => Math.min(prev + 1, userTotalPages))}
                  disabled={userPage === userTotalPages}
                  className="px-2.5 py-1 border border-slate-200 rounded text-xs font-bold bg-white text-slate-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
