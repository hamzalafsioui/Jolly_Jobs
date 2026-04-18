import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Plus, Trash2, Eye, Users, Calendar, Edit2 } from "lucide-react";
import recruiterApi from "../../api/recruiter.api";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-500",
  closed: "bg-red-100 text-red-600",
};

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingIds, setTogglingIds] = useState(new Set());

  const fetchJobs = () => {
    setLoading(true);
    recruiterApi.getMyJobs()
      .then(res => { if (res.success) setJobs(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleStatusToggle = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    
    setTogglingIds(prev => new Set(prev).add(jobId));
    try {
      const response = await recruiterApi.updateJob(jobId, { status: newStatus });
      if (response.success) {
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        ));
      }
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert("Failed to update status.");
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job offer?")) return;
    setDeletingId(id);
    try {
      await recruiterApi.deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch {
      alert("Failed to delete job.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Jobs</h1>
          <p className="text-slate-500 mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
        </div>
        <button
          onClick={() => navigate("/recruiter/post-job")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Post a Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-slate-300" />
          </div>
          <h3 className="text-slate-700 font-semibold mb-1">No jobs posted yet</h3>
          <p className="text-slate-400 text-sm mb-6">Create your first job offer to start receiving applications.</p>
          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Applications</th>
                <th className="px-6 py-4">Posted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase size={16} className="text-indigo-500" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{job.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{job.contract_type || "—"}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{job.city?.name || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Users size={14} className="text-indigo-400" />
                      {job.applications_count ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Calendar size={13} />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStatusToggle(job.id, job.status || 'active')}
                        disabled={togglingIds.has(job.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                          (job.status || 'active') === 'active' ? 'bg-indigo-600' : 'bg-slate-200'
                        } ${togglingIds.has(job.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            (job.status || 'active') === 'active' ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        (job.status || 'active') === 'active' ? 'text-indigo-600' : 'text-slate-400'
                      }`}>
                        {job.status || 'active'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/recruiter/applications?job=${job.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-semibold transition-colors"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600 text-sm font-semibold transition-colors"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={deletingId === job.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-500 text-sm font-semibold transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
