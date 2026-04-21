import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import RecruiterSidebar from "./recruiter/RecruiterSidebar";
import NotificationDropdown from "./NotificationDropdown";
import SystemNotificationDropdown from "./SystemNotificationDropdown";

export default function RecruiterLayout({ children, user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <RecruiterSidebar 
        onLogout={onLogout} 
        user={user} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 min-h-screen w-full transition-all duration-300">
        <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-jolly-purple hover:bg-jolly-purple/5 rounded-xl transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
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

        <main className="p-4 md:p-8 pb-12">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
