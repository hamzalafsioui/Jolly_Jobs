import React from "react";
import { 
  LayoutGrid, 
  PlusCircle, 
  Briefcase, 
  Users, 
  MessageSquare,
  LogOut,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function RecruiterSidebar({ onLogout, user }) {
  const location = useLocation();

  const menuItems = [
    { 
      name: "Dashboard", 
      icon: <LayoutGrid size={20} />, 
      path: "/recruiter/dashboard" 
    },
    { 
      name: "Post a Job", 
      icon: <PlusCircle size={20} />, 
      path: "/recruiter/post-job",
      isAction: true 
    },
    { 
      name: "My Jobs", 
      icon: <Briefcase size={20} />, 
      path: "/recruiter/jobs" 
    },
    { 
      name: "Candidates", 
      icon: <Users size={20} />, 
      path: "/recruiter/applications" 
    },
    { 
      name: "Messages", 
      icon: <MessageSquare size={20} />, 
      path: "/recruiter/messages" 
    },
  ];

 

  return (
    <div className="w-64 bg-[#0f111a] text-gray-400 h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-white/5">
      {/* Logo Area */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <span className="text-white font-heading font-black text-xl tracking-tight">
            J<span className="text-jolly-purple">o</span>lly J<span className="text-jolly-purple">o</span>bs
            
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.isAction) {
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-jolly-purple text-white font-bold transition-all hover:bg-jolly-deep-purple hover:scale-[1.02] active:scale-95 shadow-lg shadow-jolly-purple/20 mb-6 mt-4"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-white/5 text-white font-bold border-l-2 border-jolly-purple rounded-l-none -ml-4 pl-8" 
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`${isActive ? "text-jolly-purple" : "text-gray-400 group-hover:text-jolly-purple"} transition-colors`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02]">

        <div className="flex items-center justify-between px-4 py-2 mt-2">
            <Link 
                to="/recruiter/profile"
                className="flex items-center gap-3 overflow-hidden group/profile"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-jolly-purple to-jolly-deep-purple flex items-center justify-center text-white font-black text-sm border-2 border-white/10 shrink-0 group-hover/profile:scale-110 transition-transform">
                    {user?.first_name?.charAt(0) || "R"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate group-hover/profile:text-jolly-purple transition-colors">{user?.full_name || "Recruiter"}</p>
                    <p className="text-[10px] text-gray-500 truncate lowercase">{user?.email || "recruiter@jolly.com"}</p>
                </div>
            </Link>
            <button 
                onClick={onLogout}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-lg"
                title="Logout"
            >
                <LogOut size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}
