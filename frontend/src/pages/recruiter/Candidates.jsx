import React, { useState, useEffect } from "react";
import { Users, Search, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import recruiterApi from "../../api/recruiter.api";
import client from "../../api/client";

const STATUSES = [
  "all",
  "sent",
  "viewed",
  "shortlisted",
  "accepted",
  "rejected",
];

const STATUS_STYLES = {
  sent: "bg-amber-50  text-amber-600  border border-amber-100",
  viewed: "bg-blue-50   text-blue-600   border border-blue-100",
  shortlisted: "bg-green-50  text-green-600  border border-green-100",
  accepted: "bg-teal-50   text-teal-600   border border-teal-100",
  rejected: "bg-red-50    text-red-600    border border-red-100",
};

export default function Candidates() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [cvModal, setCvModal] = useState({ open: false, url: null, loading: false });
  const navigate = useNavigate();

  useEffect(() => {
    recruiterApi
      .getMyApplications()
      .then((res) => {
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
      result = result.filter((a) => a.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          (a.job_seeker?.user?.first_name + " " + a.job_seeker?.user?.last_name)
            .toLowerCase()
            .includes(q) || a.job_offer?.title?.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, statusFilter, applications]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await recruiterApi.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
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

  const openCv = async (app) => {
    if (!app.cv_path) return;
    setCvModal({ open: true, url: null, loading: true });
    try {
      const res = await client.get(`/applications/${app.id}/cv`);
      if (res.data.success) {
        const base64Data = res.data.data.base64;
        const contentType = res.data.data.mime || 'application/pdf';
        
        // Convert base64 to blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        
        const blobUrl = URL.createObjectURL(blob);
        setCvModal({ open: true, url: blobUrl, loading: false });
      } else {
        throw new Error("Failed to load CV data");
      }
    } catch (error) {
      setCvModal({ open: false, url: null, loading: false });
      alert("Could not load CV. Please try again.");
    }
  };

  const closeCv = () => {
    if (cvModal.url) URL.revokeObjectURL(cvModal.url);
    setCvModal({ open: false, url: null, loading: false });
  };

  const startMessage = (user) => {
    if (!user) return;
    navigate("/recruiter/messages", { state: { newContact: user } });
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
        <p className="text-slate-500 mt-1">
          {applications.length} total application
          {applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate or job…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
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
          <h3 className="text-slate-700 font-semibold mb-1">
            No candidates found
          </h3>
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
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                        {initials(app)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {candidateName(app)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {app.job_seeker?.user?.email || ""}
                        </p>
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
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[app.status] || "bg-slate-100 text-slate-500"}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <select
                        value={app.status}
                        disabled={updating === app.id}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                      >
                        {[
                          "sent",
                          "viewed",
                          "shortlisted",
                          "accepted",
                          "rejected",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      {app.cv_path && (
                        <button
                          onClick={() => openCv(app)}
                          className="text-slate-400 hover:text-indigo-600 p-1.5 rounded hover:bg-slate-100 transition-colors"
                          title="View CV"
                        >
                          <FileText size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => startMessage(app.job_seeker?.user)}
                        className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-slate-100 transition-colors"
                        title="Message Candidate"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CV Viewer Modal */}
      {cvModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-indigo-500" />
                Candidate CV
              </h3>
              <button
                onClick={closeCv}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 bg-slate-50">
              {cvModal.loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : (
                <embed
                  src={cvModal.url}
                  type="application/pdf"
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
