import React, { useState, useEffect } from "react";
import { User, Lock, Bell, Shield, Save } from "lucide-react";
import authApi from "../../api/auth.api";
import client from "../../api/client";

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function Settings() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  const availableTabs = TABS.filter(tab => !(isAdmin && tab.id === "notifications"));

  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [account, setAccount] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [notifs, setNotifs] = useState({ new_application: true, status_update: true, weekly_summary: false });
  const [role, setRole] = useState("");

  useEffect(() => {
    authApi.getMe().then(res => {
      const u = res.data;
      setRole(u.role);
      setAccount({ first_name: u.first_name || "", last_name: u.last_name || "", email: u.email || "", phone: u.phone || "" });
      if (u.notification_settings) {
        setNotifs(c => ({ ...c, ...u.notification_settings }));
      }
    }).catch(() => {});
  }, []);

  const showSuccess = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAccountSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await client.post("/auth/profile", account);
      showSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await client.post("/auth/profile", passwords);
      setPasswords({ current_password: "", password: "", password_confirmation: "" });
      showSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    setError("");
    try {
      await client.post("/auth/profile", { notification_settings: notifs });
      showSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences.</p>
      </div>

      <div className="flex gap-8">
        {/* Tab Nav */}
        <div className="w-52 shrink-0">
          <nav className="space-y-1">
            {availableTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setError(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === tab.id ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 max-w-lg">
          {saved && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm font-medium flex items-center gap-2">
              <Save size={14} /> Saved successfully!
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <form onSubmit={handleAccountSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-800 mb-4">Account Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={account.first_name}
                    onChange={e => setAccount(p => ({ ...p, first_name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={account.last_name}
                    onChange={e => setAccount(p => ({ ...p, last_name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={account.email}
                  onChange={e => setAccount(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={account.phone}
                  onChange={e => setAccount(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+212 6xx xxx xxx"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-800 mb-4">Change Password</h2>
              {["current_password", "password", "password_confirmation"].map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 capitalize">
                    {field.replace(/_/g, " ")}
                  </label>
                  <input
                    type="password"
                    value={passwords[field]}
                    onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && !isAdmin && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-slate-800 mb-4">Notification Preferences</h2>
              {[
                { key: "new_application", label: "New Application", desc: "Get notified when a candidate applies to your job.", roles: ['recruiter'] },
                { key: "status_update", label: "Status Updates", desc: "Receive updates when application statuses change.", roles: ['job_seeker'] },
                { key: "weekly_summary", label: "Weekly Summary", desc: "Get a weekly digest of your hiring activity.", roles: ['recruiter', 'job_seeker'] },
              ].filter(item => item.roles.includes(role)).map(item => (
                <div key={item.key} className="flex items-start justify-between gap-4 py-4 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-semibold text-sm text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                    className={`relative inline-flex w-11 h-6 rounded-full transition-colors shrink-0 ${notifs[item.key] ? "bg-indigo-600" : "bg-slate-200"}`}
                  >
                    <span className={`inline-block w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${notifs[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleNotificationSave}
                disabled={loading}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
