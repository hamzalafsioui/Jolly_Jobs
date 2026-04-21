import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Trash2, 
  UserPlus, 
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Ban,
  UserCheck
} from "lucide-react";
import adminApi from "../../api/admin.api";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await adminApi.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.is_active;
    const action = newStatus ? "activate" : "ban";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await adminApi.updateUser(user.id, { is_active: newStatus });
        setUsers(users.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
      } catch (err) {
        alert(`Failed to ${action} user.`);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    // Hide administrators from the list
    if (user.role === 'admin') return false;

    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jolly-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage and moderate all platform members.</p>
        </div>
        <button className="bg-jolly-purple text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-jolly-deep-purple transition-all shadow-lg shadow-jolly-purple/20 active:scale-95">
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-jolly-purple/20 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-slate-400" size={18} />
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-jolly-purple/20 transition-all cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="job_seeker">Job_Seekers</option>
            <option value="recruiter">Recruiters</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date Joined</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                          {user.email_verified_at && <CheckCircle2 size={12} className="text-teal-500" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 
                      user.role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.is_active ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg uppercase">
                          <CheckCircle2 size={10} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg uppercase">
                          <XCircle size={10} /> Banned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-600">
                      {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 rounded-lg transition-all ${
                          user.is_active 
                            ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50" 
                            : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                        }`} 
                        title={user.is_active ? "Ban User" : "Unban User"}
                      >
                        {user.is_active ? <Ban size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete User"
                        disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert className="text-slate-200" size={48} />
                      <p className="text-slate-500 font-bold">No users found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
