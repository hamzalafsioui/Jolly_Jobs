import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Trash2, 
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  MapPin,
  Building2
} from "lucide-react";
import adminApi from "../../api/admin.api";
import swal from "../../utils/swal";

export default function JobsManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getJobs();
      setJobs(response.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    const result = await swal.confirm("Delete Job", "Are you sure you want to delete this job posting? This cannot be undone.");
    if (result.isConfirmed) {
      try {
        await adminApi.deleteJob(id);
        setJobs(jobs.filter(job => job.id !== id));
      } catch (err) {
        swal.error("Error", "Failed to delete job.");
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.recruiter?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
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
          <h1 className="text-2xl font-black text-slate-900">Job Moderation</h1>
          <p className="text-slate-500 mt-1">Review and manage all active job postings.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-jolly-purple/20 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-slate-400" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-jolly-purple/20 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid/Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-jolly-purple shrink-0 group-hover:scale-105 transition-transform">
                <Building2 size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-jolly-purple transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    job.status === 'active' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><Building2 size={14} className="text-slate-400" /> {job.recruiter?.company_name || "Company"}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {job.location || "Remote"}</span>
                  <span className="flex items-center gap-1.5 font-bold text-jolly-purple"><Briefcase size={14} /> {job.contract_type}</span>
                </div>
                <div className="flex items-center gap-4 pt-1">
                   <p className="text-xs text-slate-400 flex items-center gap-1">
                     <Clock size={12} /> Posted {new Date(job.created_at).toLocaleDateString()}
                   </p>
                   <p className="text-xs text-slate-400 flex items-center gap-1">
                     <Eye size={12} /> {job.views_count || 0} views
                   </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:border-l md:pl-6 border-slate-100 shrink-0">
               <button className="flex-1 md:flex-none p-3 text-slate-400 hover:text-jolly-purple hover:bg-jolly-purple/5 rounded-xl transition-all" title="View Job Details">
                 <ExternalLink size={18} />
               </button>
               <button className="flex-1 md:flex-none p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Job" onClick={() => handleDeleteJob(job.id)}>
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        )) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center col-span-full">
            <div className="flex flex-col items-center gap-3">
               <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <AlertCircle size={32} />
               </div>
               <p className="text-slate-500 font-bold">No jobs found matching your criteria</p>
               <button 
                onClick={() => {setSearchTerm(""); setStatusFilter("all");}}
                className="text-sm font-bold text-jolly-purple hover:underline"
               >
                 Clear all filters
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
