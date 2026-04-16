import React, { useState, useEffect } from "react";
import { Users, Search, Filter, ChevronDown } from "lucide-react";
import recruiterApi from "../../api/recruiter.api";

const STATUSES = ["all", "sent", "viewed", "shortlisted", "accepted", "rejected"];

const STATUS_STYLES = {
  sent:        "bg-amber-50  text-amber-600  border border-amber-100",
  viewed:      "bg-blue-50   text-blue-600   border border-blue-100",
  shortlisted: "bg-green-50  text-green-600  border border-green-100",
  accepted:    "bg-teal-50   text-teal-600   border border-teal-100",
  rejected:    "bg-red-50    text-red-600    border border-red-100",
};

export default function Candidates() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating]         = useState(null);

  useEffect(() => {
    recruiterApi.getMyApplications()
      .then(res => {
        if (res.success) {
          setApplications(res.data);
          setFiltered(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = applications;
    if (statusFilter !== "all") {
      result = result.filter(a => a.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        (a.job_seeker?.user?.first_name + " " + a.job_seeker?.user?.last_name).toLowerCase().includes(q) ||
        a.job_offer?.title?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, applications]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await recruiterApi.updateApplicationStatus(appId, newStatus);
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status: newStatus } : a)
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const candidateName = (app) => {
    const u = app.job_seeker?.user;
    return u ? `${u.first_name} ${u.last_name}` : "Unknown";
  };

  const initials = (app) => {
    const u = app.job_seeker?.user;
    return u ? u.first_name?.charAt(0).toUpperCase() : "?";
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Candidates</h1>
        <p className="text-slate-500 mt-1">{applications.length} total application{applications.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate or job…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-slate-300" />
          </div>
          <h3 className="text-slate-700 font-semibold mb-1">No candidates found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Job</th>
                <th className="px-6 py-4">Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                        {initials(app)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{candidateName(app)}</p>
                        <p className="text-xs text-slate-400">{app.job_seeker?.user?.email || ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate">
                    {app.job_offer?.title || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[app.status] || "bg-slate-100 text-slate-500"}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={app.status}
                      disabled={updating === app.id}
                      onChange={e => handleStatusChange(app.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                    >
                      {["sent", "viewed", "shortlisted", "accepted", "rejected"].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
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
