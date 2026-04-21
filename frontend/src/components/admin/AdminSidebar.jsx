import React from "react";
import { 
  LayoutGrid, 
  Users, 
  Briefcase, 
  Settings,
  LogOut,
  ShieldCheck,
  BarChart3,
  FileText,
  Tag
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ onLogout, user, isOpen, setIsOpen }) {
  const location = useLocation();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) { 
      setIsOpen(false);
    }
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      icon: <LayoutGrid size={20} />, 
      path: "/admin/dashboard" 
    },
    { 
      name: "Manage Users", 
      icon: <Users size={20} />, 
      path: "/admin/users" 
    },
    { 
      name: "Moderate Jobs", 
      icon: <Briefcase size={20} />, 
      path: "/admin/jobs" 
    },
    { 
      name: "Manage Skills", 
      icon: <Tag size={20} />, 
      path: "/admin/skills" 
    },
  ];

  const bottomItems = [
    { 
      name: "Settings", 
      icon: <Settings size={20} />, 
      path: "/admin/settings" 
    },
  ];

  return (
    <div className={`w-64 bg-[#1e293b] text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo Area */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-jolly-purple rounded-lg flex items-center justify-center text-white shrink-0">
            <ShieldCheck size={20} />
          </div>
          <span className="text-white font-heading font-black text-xl tracking-tight">
            Admin<span className="text-jolly-purple"> Space</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-jolly-purple text-white font-bold shadow-lg shadow-jolly-purple/20" 
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-jolly-purple"} transition-colors`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all text-sm mb-2"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        <div className="flex items-center justify-between px-4 py-2 mt-2 bg-slate-800/50 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-jolly-purple to-jolly-deep-purple flex items-center justify-center text-white font-black text-sm border-2 border-white/10 shrink-0">
                    {user?.name?.charAt(0) || "A"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user?.name || "Admin"}</p>
                    <p className="text-[10px] text-slate-500 truncate lowercase">Administrator</p>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-lg"
                title="Logout"
            >
                <LogOut size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}
