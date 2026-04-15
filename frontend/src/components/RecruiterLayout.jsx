import React from "react";
import RecruiterSidebar from "./recruiter/RecruiterSidebar";

export default function RecruiterLayout({ children, user, onLogout }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <RecruiterSidebar onLogout={onLogout} user={user} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Recruiter center</h2>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || "Recruiter"}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">Hiring Manager</p>
                    </div>
                </div>
                
                <button className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
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
