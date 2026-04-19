import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import notificationApi from "../api/notification.api";
import echo from "../echo";

const SystemNotificationDropdown = ({ user, triggerClassName = "" }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const seenNotificationIds = useRef(new Set());
  const notifDropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Initial fetch
      notificationApi.getNotifications().then((res) => {
        if (res.success) {
          const notifications = res.data;
          setRecentNotifications(notifications.slice(0, 5));
          const unread = notifications.filter(n => !n.is_read).length;
          setUnreadCount(unread);
          notifications.forEach(n => seenNotificationIds.current.add(n.id));
        }
      });

      // Listen for real time notifications
      const channelName = `App.Models.User.${user.id}`;
      echo.private(channelName).listen(".NotificationSent", (e) => {
        if (!seenNotificationIds.current.has(e.id)) {
          seenNotificationIds.current.add(e.id);
          setUnreadCount((prev) => prev + 1);
          setRecentNotifications((prev) => [e, ...prev].slice(0, 5));
        }
      });

      return () => {
        // Only leave the notification event listener (we shouldn't disconnect the whole channel as Messages need it)
        // coz echo.leave removes the entire channel.
        echo.private(channelName).stopListening('.NotificationSent');
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
    
    if (newState && unreadCount > 0) {
      notificationApi.markAllRead().then(() => {
        setUnreadCount(0);
        setRecentNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      });
    }
  };

  const getNotificationLink = (notif) => {
    if (notif.type === 'new_application') {
      return '/recruiter/applications';
    }
    return '#';
  };

  return (
    <div className="relative" ref={notifDropdownRef}>
      <button
        onClick={toggleNotifications}
        className={`relative ${triggerClassName} transition-all ${
          isNotifOpen ? "text-indigo-600 bg-indigo-50" : ""
        }`}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-white z-10 shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isNotifOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">System Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notif) => (
                <Link
                  key={notif.id}
                  to={getNotificationLink(notif)}
                  onClick={() => setIsNotifOpen(false)}
                  className={`block items-start gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!notif.is_read ? 'bg-indigo-50/50' : ''}`}
                >
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
                      {notif.content}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                  <Bell size={20} />
                </div>
                <p className="text-xs text-slate-500">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemNotificationDropdown;
