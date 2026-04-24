import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Search,
  Loader2,
  InboxIcon,
  ArrowLeft,
} from "lucide-react";
import messageApi from "../../api/message.api";
import echo from "../../echo";

/* ======== helpers Functions =========== */

function initials(user) {
  return `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
}

function timeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now - d) / 3600000;
  if (diffH < 24)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffH < 48) return "Yesterday";
  return d.toLocaleDateString([], { day: "2-digit", month: "short" });
}

/* ============== component ================ */
export default function JobSeekerMessages({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  /* ======= fetch conversations on mount ======= */
  useEffect(() => {
    messageApi
      .getConversations()
      .then((res) => {
        if (res.success) {
          setConversations(res.data);
          if (res.data.length > 0) selectConversation(res.data[0]);
        }
      })
      .finally(() => setLoadingConvs(false));
  }, []);

  /* ======= scroll to bottom when messages change ===== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeIdRef = useRef(null);
  useEffect(() => {
    activeIdRef.current = active?.user?.id;
  }, [active]);

  /* ======== global websockets listener ======== */
  useEffect(() => {
    if (!currentUser) return;
    const channelName = `App.Models.User.${currentUser.id}`;

    echo.private(channelName).listen(".MessageSent", (e) => {
      if (e.sender_id === currentUser.id) return;

      const partnerId = e.sender_id;

      if (activeIdRef.current === partnerId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === e.id)) return prev;
          return [...prev, e];
        });
        messageApi.markRead(partnerId);

        setConversations((prev) => {
          const exists = prev.find((c) => c.user.id === partnerId);
          if (exists) {
            return prev.map((c) =>
              c.user.id === partnerId
                ? {
                    ...c,
                    last_message: {
                      content: e.content,
                      created_at: e.created_at,
                    },
                    unread_count: 0,
                  }
                : c,
            );
          }
          return [
            {
              user: e.sender,
              last_message: { content: e.content, created_at: e.created_at },
              unread_count: 0,
            },
            ...prev,
          ];
        });
      } else {
        setConversations((prev) => {
          const exists = prev.find((c) => c.user.id === partnerId);
          if (exists) {
            return prev.map((c) =>
              c.user.id === partnerId
                ? {
                    ...c,
                    last_message: {
                      content: e.content,
                      created_at: e.created_at,
                    },
                    unread_count: c.unread_count + 1,
                  }
                : c,
            );
          }
          return [
            {
              user: e.sender,
              last_message: { content: e.content, created_at: e.created_at },
              unread_count: 1,
            },
            ...prev,
          ];
        });
      }
    });
  }, [currentUser]);

  const selectConversation = useCallback((conv) => {
    setActive(conv);
    setLoadingMsgs(true);

    const partnerId = conv.user.id;

    messageApi
      .getMessages(partnerId)
      .then((res) => {
        if (res.success) {
          setMessages(res.data);
        }
      })
      .finally(() => setLoadingMsgs(false));

    messageApi.markRead(partnerId).then((res) => {
      if (res.success) {
        setConversations((prev) =>
          prev.map((c) =>
            c.user.id === partnerId ? { ...c, unread_count: 0 } : c,
          ),
        );
      }
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !active || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);

    const optimistic = {
      id: `opt-${Date.now()}`,
      sender_id: currentUser?.id,
      receiver_id: active.user.id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await messageApi.sendMessage(active.user.id, content);
      setConversations((prev) =>
        prev.map((c) =>
          c.user.id === active.user.id
            ? {
                ...c,
                last_message: { content, created_at: optimistic.created_at },
              }
            : c,
        ),
      );
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter((c) =>
    `${c.user.first_name} ${c.user.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  /* =============== render =================== */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Messages</h1>
        <p className="text-slate-500 mt-1">
          Your conversations with recruiters.
        </p>
      </div>

      <div
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex relative"
        style={{ height: "calc(100vh - 240px)", minHeight: 480 }}
      >
        {/* ===== Sidebar ====== */}
        <div
          className={`w-full lg:w-72 border-r border-slate-100 flex flex-col shrink-0 ${active && "hidden lg:flex"}`}
        >
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recruiters…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex items-center justify-center h-32 text-slate-400">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-slate-400 px-4 text-center">
                <InboxIcon size={20} />
                <p className="text-xs">
                  No messages yet. A recruiter will reach out!
                </p>
              </div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${
                    active?.user.id === conv.user.id ? "bg-indigo-50" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0 text-sm">
                    {initials(conv.user)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm text-slate-800 truncate">
                        {conv.user.first_name} {conv.user.last_name}
                      </p>
                      <span className="text-xs text-slate-400 shrink-0 ml-1">
                        {timeLabel(conv.last_message?.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {conv.last_message?.content ?? ""}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="shrink-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ======== Chat Window ======= */}
        {active ? (
          <div className="flex-1 flex flex-col w-full">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <button
                onClick={() => setActive(null)}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Back to conversations"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm shrink-0">
                {initials(active.user)}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800">
                  {active.user.first_name} {active.user.last_name}
                </p>
                <p className="text-xs text-slate-400 capitalize">Recruiter</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMsgs ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <Loader2 size={20} className="animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                  <MessageSquare size={28} />
                  <p className="text-sm">No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                          isMine
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-slate-100 text-slate-700 rounded-bl-sm"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${isMine ? "text-indigo-200" : "text-slate-400"}`}
                        >
                          {timeLabel(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Reply input — job seekers can always reply in an existing conversation */}
            <div className="px-6 py-4 border-t border-slate-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a reply…"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
            <MessageSquare size={40} strokeWidth={1.5} />
            <p className="text-sm">Select a conversation to reply</p>
          </div>
        )}
      </div>
    </div>
  );
}
