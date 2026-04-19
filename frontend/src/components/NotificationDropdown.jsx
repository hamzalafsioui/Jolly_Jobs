import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Bell } from "lucide-react";
import messageApi from "../api/message.api";
import echo from "../echo";

const NotificationDropdown = ({ user, triggerClassName = "" }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [recentConversations, setRecentConversations] = useState([]);
  const seenMessageIds = useRef(new Set());
  const notifDropdownRef = useRef(null);

  const messagesPath = user?.role === "recruiter" ? "/recruiter/messages" : "/messages";

  useEffect(() => {
    if (user) {
      // Initial unread count fetch
      messageApi.getUnreadCount().then((res) => {
        if (res.success) {
          setUnreadCount(Number(res.data.count) || 0);
        }
      });

      // Listen for real time messages
      const channelName = `App.Models.User.${user.id}`;
      echo.private(channelName).listen(".MessageSent", (e) => {
        // Simple increment: notification only shows => never auto-hides
        if (e.sender_id !== user.id && !seenMessageIds.current.has(e.id)) {
          seenMessageIds.current.add(e.id);
          setUnreadCount((prev) => Number(prev) + 1);
        }
      });

      return () => {
        echo.leave(channelName);
      };
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    const newState = !isNotifOpen;
    setIsNotifOpen(newState);
    
    // Recalculate/refresh on open
    if (newState) {
      messageApi.getUnreadCount().then((res) => {
        if (res.success) setUnreadCount(Number(res.data.count));
      });
      messageApi.getConversations().then((res) => {
        if (res.success) {
          setRecentConversations(res.data.slice(0, 5));
        }
      });
    }
  };

  return (
    <div className="relative" ref={notifDropdownRef}>
      <button
        onClick={toggleNotifications}
        className={`relative ${triggerClassName} transition-all ${
          isNotifOpen ? "text-indigo-600 bg-indigo-50" : ""
        }`}
      >
        <MessageCircle size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white z-10 shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isNotifOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Messages</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentConversations.length > 0 ? (
              recentConversations.map((conv) => (
                <Link
                  key={conv.user.id}
                  to={messagesPath}
                  state={{ activeId: conv.user.id }}
                  onClick={() => setIsNotifOpen(false)}
                  className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {conv.user.first_name?.[0]}
                    {conv.user.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {conv.user.first_name} {conv.user.last_name}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.last_message
                          ? new Date(conv.last_message.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {conv.last_message?.content || "Started a conversation"}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
                  )}
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                  <MessageCircle size={20} />
                </div>
                <p className="text-xs text-slate-500">No new messages</p>
              </div>
            )}
          </div>

          <Link
            to={messagesPath}
            onClick={() => setIsNotifOpen(false)}
            className="block p-3 text-center text-xs font-bold text-indigo-600 bg-slate-50 hover:bg-indigo-50 transition-colors border-t border-slate-100"
          >
            View all messages
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
