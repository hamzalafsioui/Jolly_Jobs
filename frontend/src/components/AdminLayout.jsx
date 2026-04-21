import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./admin/AdminSidebar";

export default function AdminLayout({ children, user, onLogout }) {
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
      <AdminSidebar 
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

                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-jolly-purple animate-pulse"></span>
                    <h2 className="text-lg font-bold text-slate-800">Admin Panel</h2>
                </div>
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

        <main className="p-4 md:p-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
