import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Users, 
  FileText, 
  Eye, 
  ArrowUpRight, 
  MoreHorizontal,
  Clock,
  PlusCircle,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import recruiterApi from "../api/recruiter.api";

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recruiterApi.getDashboardData()
      .then(res => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch(err => console.error("Failed to fetch dashboard data", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-jolly-purple/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-jolly-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Failed to load statistics</h3>
        <p className="text-slate-500">Please try refreshing the page or check your connection.</p>
    </div>
  );

  const stats = [
    { name: "Active Jobs", value: data.stats.active_jobs, icon: <Briefcase size={22} />, color: "bg-indigo-500", shadow: "shadow-indigo-200" },
    { name: "Total Applications", value: data.stats.total_applications, icon: <Users size={22} />, color: "bg-jolly-purple", shadow: "shadow-jolly-purple/30" },
    { name: "New Apps Today", value: data.stats.new_applications_today, icon: <TrendingUp size={22} />, color: "bg-emerald-500", shadow: "shadow-emerald-200" },
    { name: "Total Job Views", value: data.stats.total_views, icon: <Eye size={22} />, color: "bg-amber-500", shadow: "shadow-amber-200" },
  ];

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-black text-slate-800 m-0">Dashboard Overview</h1>
              <p className="text-slate-500 font-medium mt-1">Monitor your hiring progress and manage applications.</p>
          </div>
          <button 
            onClick={() => window.location.href = "/recruiter/post-job"}
            className="flex items-center gap-2 bg-jolly-purple text-white px-6 py-3 rounded-2xl font-bold hover:bg-jolly-deep-purple transition-all shadow-lg shadow-jolly-purple/20 active:scale-95"
          >
            <PlusCircle size={20} />
            Post New Job
          </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={stat.name} 
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group hover:-translate-y-1"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className={`${stat.color} text-white p-4 rounded-2xl shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.name}</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none mt-1">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications By Status */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-800">Application Status</h3>
              <button className="text-slate-300 hover:text-jolly-purple transition-colors p-2 hover:bg-slate-50 rounded-xl"><MoreHorizontal size={20} /></button>
           </div>
           
           <div className="relative flex justify-center py-6">
              <div className="w-52 h-52 rounded-full border-[20px] border-slate-50 flex items-center justify-center relative">
                 <div className="text-center">
                    <p className="text-4xl font-black text-slate-800 leading-none">{data.stats.total_applications}</p>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-2">Total Apps</p>
                 </div>
                 {/* Visual decoration for the ring */}
                 <div className="absolute inset-[-20px] rounded-full border-[20px] border-jolly-purple border-t-transparent border-r-transparent border-b-transparent transform rotate-45 opacity-80"></div>
                 <div className="absolute inset-[-20px] rounded-full border-[20px] border-emerald-400 border-l-transparent border-r-transparent border-b-transparent transform -rotate-12 opacity-80"></div>
              </div>
           </div>

           <div className="mt-10 space-y-4">
              {Object.entries(data.applications_by_status).length > 0 ? (
                Object.entries(data.applications_by_status).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                       <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} group-hover:scale-125 transition-transform`}></div>
                          <p className="text-xs font-bold text-slate-700 capitalize">{status}</p>
                       </div>
                       <p className="text-xs font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">{count}</p>
                    </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm font-medium italic">No data available</div>
              )}
           </div>
        </div>

        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
           <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-800">Recent Applications</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Latest candidate submissions</p>
              </div>
              <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100">View All</button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase font-black text-slate-400 tracking-[0.15em] border-b border-slate-50">
                    <th className="pb-5 pt-2">Candidate</th>
                    <th className="pb-5 pt-2">Job Offer</th>
                    <th className="pb-5 pt-2">Status</th>
                    <th className="pb-5 pt-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recent_applications.map((app) => (
                    <tr key={app.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-100 to-white flex items-center justify-center text-slate-700 font-black text-xs border border-slate-200 shadow-sm transition-transform group-hover:rotate-3">
                             {app.job_seeker?.user?.first_name?.charAt(0) || "C"}
                           </div>
                           <div>
                            <p className="text-sm font-bold text-slate-800">{app.job_seeker?.user?.first_name} {app.job_seeker?.user?.last_name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm text-slate-600 font-medium">{app.job_offer?.title}</td>
                      <td className="py-5">
                         <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border border-transparent transition-colors ${getStatusClass(app.status)}`}>
                            {app.status}
                         </span>
                      </td>
                      <td className="py-5 text-right">
                         <button className="text-jolly-purple hover:bg-jolly-purple/5 p-2 rounded-xl transition-all">
                            <ArrowUpRight size={18} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.recent_applications.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users size={20} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">No applications yet.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* My Active Jobs */}
         <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-800">My Active Jobs</h3>
              <button className="text-jolly-purple text-xs font-black hover:underline underline-offset-4">See All Jobs</button>
            </div>
            <div className="space-y-4">
               {data.top_jobs.map((job) => (
                 <div key={job.id} className="p-5 border border-slate-50 rounded-[1.5rem] flex items-center justify-between hover:border-jolly-purple/20 hover:bg-jolly-purple/[0.01] transition-all group">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:bg-jolly-purple transition-colors">
                          <Briefcase size={24} />
                       </div>
                       <div>
                          <h4 className="text-base font-bold text-slate-800">{job.title}</h4>
                          <div className="flex items-center mt-1.5 gap-4">
                            <p className="text-[11px] text-slate-400 flex items-center font-bold">
                               <Users size={12} className="mr-1.5 text-jolly-teal" /> {job.applications_count} Candidates 
                            </p>
                            <p className="text-[11px] text-slate-400 flex items-center font-bold">
                               <Clock size={12} className="mr-1.5 text-amber-500" /> {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-slate-50 rounded-xl transition-all"><MoreHorizontal size={18} /></button>
                       <button className="px-5 py-2.5 text-xs font-black text-jolly-purple bg-jolly-purple/5 rounded-xl hover:bg-jolly-purple/10 transition-all">Manage</button>
                    </div>
                 </div>
               ))}
               {data.top_jobs.length === 0 && (
                 <div className="text-center py-20 border-3 border-dashed border-slate-100 rounded-[2rem]">
                    <h4 className="text-slate-400 font-bold mb-4">You haven't posted any jobs yet.</h4>
                    <button 
                        onClick={() => window.location.href = "/recruiter/post-job"}
                        className="text-jolly-purple font-black text-sm hover:underline"
                    >
                        Create your first job offer
                    </button>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'shortlisted': return 'bg-emerald-400';
    case 'viewed': return 'bg-indigo-400';
    case 'rejected': return 'bg-rose-400';
    case 'accepted': return 'bg-jolly-teal';
    default: return 'bg-amber-400';
  }
};

const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'shortlisted': return 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100';
    case 'viewed': return 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100';
    case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100';
    case 'accepted': return 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100';
    default: return 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100';
  }
};
