import React from "react";
import RecruiterSidebar from "./recruiter/RecruiterSidebar";
import NotificationDropdown from "./NotificationDropdown";
import SystemNotificationDropdown from "./SystemNotificationDropdown";

export default function RecruiterLayout({ children, user, onLogout }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <RecruiterSidebar onLogout={onLogout} user={user} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              Recruiter center
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* System Notifications Dropdown */}
            <SystemNotificationDropdown
              user={user}
              triggerClassName="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl relative overflow-visible transition-colors"
            />
            {/* Shared Notification Dropdown (Messages) */}
            <NotificationDropdown
              user={user}
              triggerClassName="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl relative overflow-visible transition-colors"
            />
          </div>
        </header>

        <main className="p-8 pb-12">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
