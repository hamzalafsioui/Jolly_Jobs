import React from "react";
import AdminSidebar from "./admin/AdminSidebar";

export default function AdminLayout({ children, user, onLogout }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <AdminSidebar onLogout={onLogout} user={user} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-jolly-purple animate-pulse"></span>
                <h2 className="text-lg font-bold text-slate-800">Admin Control Panel</h2>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || "Administrator"}</p>
                        <p className="text-[11px] text-jolly-purple font-bold mt-1 uppercase tracking-tighter">Super Admin</p>
                    </div>
                </div>
            </div>
        </header>

        <main className="p-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
