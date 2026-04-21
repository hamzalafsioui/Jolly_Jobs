import React, { useState, useEffect } from "react";
import { 
  Users, 
  Briefcase, 
  FileCheck, 
  TrendingUp,
  UserCheck,
  Building2,
  Clock,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import adminApi from "../../api/admin.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStats();
      setStats(data.data);
    } catch (err) {
      setError("Failed to load dashboard statistics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jolly-purple"></div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Users", 
      value: stats?.stats?.total_users || 0, 
      subValue: `${stats?.stats?.users_this_month || 0} this month`,
      icon: <Users size={24} />, 
      color: "bg-jolly-purple/10 text-jolly-purple" 
    },
    { 
      label: "Active Jobs", 
      value: stats?.stats?.active_jobs || 0, 
      subValue: `Out of ${stats?.stats?.total_jobs || 0} total`,
      icon: <Briefcase size={24} />, 
      color: "bg-teal-50 text-teal-600" 
    },
    { 
      
      label: "Applications", 
      value: stats?.stats?.total_applications || 0, 
      subValue: `${stats?.stats?.applications_today || 0} today`,
      icon: <FileCheck size={24} />, 
      color: "bg-indigo-50 text-indigo-600" 
    },
    { 
      label: "Job Seekers", 
      value: stats?.stats?.job_seekers || 0, 
      subValue: `${stats?.stats?.recruiters || 0} recruiters`,
      icon: <UserCheck size={24} />, 
      color: "bg-amber-50 text-amber-600" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Real time platform metrics and activity.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="text-sm font-bold text-jolly-purple hover:underline flex items-center gap-2"
        >
          Refresh Data <Clock size={14} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/0 px-2 py-1 rounded-lg"></span>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs font-bold text-slate-400">
              <TrendingUp size={14} className="mr-1 text-teal-500" />
              {card.subValue}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-black text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-jolly-purple" />
              Recent Job Postings
            </h2>
            <button className="text-xs font-bold text-jolly-purple hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {stats?.recent_jobs?.map((job) => (
              <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all font-bold uppercase text-xs">
                    {job.recruiter?.company_name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{job.title}</h4>
                    <p className="text-xs text-slate-500">{job.recruiter?.company_name || "Company"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date(job.created_at).toLocaleDateString()}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${job.status === 'active' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-black text-slate-900 flex items-center gap-2">
              <UserCheck size={18} className="text-teal-600" />
              New Registered Users
            </h2>
            <button className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {stats?.recent_users?.map((user) => (
              <div key={user.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform font-bold text-xs">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{user.name}</h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 
                    user.role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' : 
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
