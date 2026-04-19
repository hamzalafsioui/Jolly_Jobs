import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search, Bell, User, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import NotificationDropdown from "./NotificationDropdown";
import SystemNotificationDropdown from "./SystemNotificationDropdown";

const Header = ({ onLogout, isLoggedIn = false, user = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Find Jobs", to: "/jobs" },
  ];

  const messagesPath = user?.role === "recruiter" ? "/recruiter/messages" : "/messages";

  const handleLogoClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo & Nav */}
          <div className="flex items-center space-x-10">
            <div 
              className="shrink-0 flex items-center cursor-pointer" 
              onClick={handleLogoClick}
            >
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`text-[15px] font-medium transition-colors ${
                    isActive(link.to) ? "text-jolly-purple" : "text-jolly-slate hover:text-jolly-purple"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn && user?.role === 'job_seeker' && (
                <Link
                  to="/saved-jobs"
                  className={`text-[15px] font-medium transition-colors ${
                    isActive("/saved-jobs") ? "text-jolly-purple font-bold" : "text-jolly-slate hover:text-jolly-purple"
                  }`}
                >
                  Saved Jobs
                </Link>
              )}
              {isLoggedIn && (
                <Link
                  to={messagesPath}
                  className={`text-[15px] font-medium transition-colors ${
                    isActive(messagesPath) ? "text-jolly-purple font-bold" : "text-jolly-slate hover:text-jolly-purple"
                  }`}
                >
                  Messages
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {isLoggedIn ? (
              <>
                {/* Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400 group-focus-within:text-jolly-purple transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-jolly-purple/20 focus:border-jolly-purple transition-all"
                  />
                </div>

                {/* Shared Notification Dropdown */}
                <div className="flex items-center space-x-2">
                  <SystemNotificationDropdown 
                    user={user} 
                    triggerClassName="p-2 text-jolly-slate hover:text-jolly-purple hover:bg-gray-100 rounded-full flex items-center justify-center"
                  />
                  <NotificationDropdown 
                    user={user} 
                    triggerClassName="p-2 text-jolly-slate hover:text-jolly-purple hover:bg-gray-100 rounded-full flex items-center justify-center"
                  />
                </div>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-3">
                  <Link 
                    to={user?.role === 'recruiter' ? "/recruiter/profile" : "/profile"}
                    className="flex items-center space-x-2 pl-2 pr-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-jolly-purple/10 flex items-center justify-center text-jolly-purple">
                      <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-jolly-navy">
                      {user?.first_name || "User"}
                    </span>
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-jolly-navy transition-colors" />
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="text-sm font-medium text-danger hover:text-red-700 transition-colors px-2"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[15px] font-medium text-jolly-slate hover:text-jolly-purple transition-colors cursor-pointer"
                >
                  Log In
                </Link>
                <button className="bg-jolly-purple text-white px-6 py-2.5 rounded-button font-medium hover:bg-jolly-deep-purple transition-all shadow-sm hover:shadow-md active:scale-95">
                  Post a Job
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-jolly-slate hover:text-jolly-purple p-2 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2 animate-in slide-in-from-top duration-200">
          {isLoggedIn && (
            <Link 
              to={user?.role === 'recruiter' ? "/recruiter/profile" : "/profile"}
              onClick={() => setIsMenuOpen(false)}
              className="pb-4 mb-4 border-b border-gray-100 flex items-center space-x-3 px-3 hover:bg-gray-50 transition-colors rounded-xl"
            >
               <div className="w-10 h-10 rounded-full bg-jolly-purple/10 flex items-center justify-center text-jolly-purple">
                  <User size={22} />
               </div>
               <div>
                 <div className="text-sm font-bold text-jolly-navy">{user?.full_name || user?.first_name || "User"}</div>
                 <div className="text-xs text-jolly-slate">Account Settings</div>
               </div>
            </Link>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-jolly-slate hover:text-jolly-purple hover:bg-gray-50 rounded-md transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn && user?.role === 'job_seeker' && (
            <Link
              to="/saved-jobs"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive("/saved-jobs") ? "text-jolly-purple bg-jolly-purple/5 font-bold" : "text-jolly-slate hover:text-jolly-purple hover:bg-gray-50"
              }`}
            >
              Saved Jobs
            </Link>
          )}
          {isLoggedIn && (
            <Link
              to={messagesPath}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActive(messagesPath) ? "text-jolly-purple bg-jolly-purple/5 font-bold" : "text-jolly-slate hover:text-jolly-purple hover:bg-gray-50"
              }`}
            >
              Messages
            </Link>
          )}
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2 px-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left py-2 text-base font-medium text-jolly-slate hover:text-jolly-purple transition-colors cursor-pointer"
                >
                  Log In
                </Link>
                <button className="w-full bg-jolly-purple text-white px-6 py-3 rounded-button font-medium hover:bg-jolly-deep-purple transition-colors">
                  Post a Job
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 text-base font-medium text-danger hover:bg-danger/5 px-3 rounded-md transition-colors"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


export default Header;

