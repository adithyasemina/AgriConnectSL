"use client";

import { api } from "@/lib/api";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  LuCheck,
  LuLoaderCircle,
  LuMessageCircle,
  LuSearch,
  LuSend,
  LuUser,
} from "react-icons/lu";

type ChatMessage = {
  _id?: string;
  senderId: string;
  senderName?: string;
  senderRole: "farmer" | "officer";
  text: string;
  createdAt: string;
};

type Chat = {
  _id: string;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  province: string;
  district: string;
  status: "open" | "done";
  messages: ChatMessage[];
  assignedOfficerId?: string | null;
  assignedOfficerName?: string;
  assignedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [selectedChat]);

  const fetchChats = async () => {
    setLoading(true);

    try {
      const response = await api.get("/api/messages/officer");
      const data: Chat[] = response.data.chats || [];
      setChats(data);
      setSelectedChat(data[0] || null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return chats;

    return chats.filter(
      (chat) =>
        chat.farmerName.toLowerCase().includes(query) ||
        chat.farmerEmail.toLowerCase().includes(query) ||
        chat.district.toLowerCase().includes(query) ||
        chat.province.toLowerCase().includes(query)
    );
  }, [chats, searchQuery]);

  const updateChatState = (updatedChat: Chat) => {
    setChats((prev) => {
      const exists = prev.some((chat) => chat._id === updatedChat._id);
      const next = exists
        ? prev.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat))
        : [updatedChat, ...prev];

      return [...next].sort((a, b) => {
        if (a.status === "open" && b.status === "done") return -1;
        if (a.status === "done" && b.status === "open") return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    });

    setSelectedChat(updatedChat);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";

    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };

  const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || "F";

  const getLastMessage = (chat: Chat) => {
    const lastMessage = chat.messages?.[chat.messages.length - 1];
    return lastMessage?.text || "No messages yet";
  };

  const isAssigned = Boolean(selectedChat?.assignedOfficerId);
  const isDone = selectedChat?.status === "done";

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChat) return;

    if (!replyText.trim()) {
      toast.error("Reply message is required");
      return;
    }


    setSending(true);

    try {
      const response = await api.post(`/api/messages/${selectedChat._id}/reply`, {
        text: replyText.trim(),
      });

      updateChatState(response.data.chat);
      setReplyText("");
      toast.success("Reply sent successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleDone = async () => {
    if (!selectedChat) return;

    setDoneLoading(true);

    try {
      const response = await api.patch(`/api/messages/${selectedChat._id}/done`);
      updateChatState(response.data.chat);
      toast.success("Chat marked as done");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark chat as done");
    } finally {
      setDoneLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <LuLoaderCircle className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-lg font-medium text-slate-500">Loading messages data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-0">
      <div className="h-[calc(100vh-110px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[390px_1fr]">
          <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="relative">
                <LuSearch className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search farmers..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="h-[calc(100%-81px)] overflow-y-auto">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  const active = selectedChat?._id === chat._id;

                  return (
                    <button
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`flex w-full gap-4 border-b border-slate-100 p-5 text-left transition hover:bg-slate-50 ${
                        active ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                        {getInitial(chat.farmerName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">
                              {chat.farmerName}
                            </p>
                            <p className="truncate text-sm font-medium text-slate-500">
                              {chat.farmerEmail}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                              chat.status === "done"
                                ? "bg-green-100 text-green-700"
                                : chat.assignedOfficerId
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {chat.status === "done"
                              ? "done"
                              : chat.assignedOfficerId
                              ? "assigned"
                              : "open"}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-1 text-xs font-medium text-slate-500">
                          {getLastMessage(chat)}
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-slate-400">
                          {chat.province} / {chat.district}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <LuMessageCircle className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-sm font-black text-slate-700">No messages found</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Farmer messages from your district will appear here.
                  </p>
                </div>
              )}
            </div>
          </aside>

          <section className="flex min-h-0 flex-col">
            {selectedChat ? (
              <>
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                      {getInitial(selectedChat.farmerName)}
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">
                        {selectedChat.farmerName}
                      </h2>
                      <p className="text-sm font-medium text-slate-500">
                        {selectedChat.farmerEmail}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {selectedChat.province} / {selectedChat.district}
                      </p>
                      {selectedChat.assignedOfficerName && selectedChat.status !== "done" && (
                        <p className="mt-1 text-xs font-black text-purple-600">
                          Assigned to {selectedChat.assignedOfficerName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={handleDone}
                      disabled={doneLoading || selectedChat.status === "done"}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {doneLoading ? (
                        <LuLoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <LuCheck className="h-4 w-4" />
                      )}
                      {selectedChat.status === "done" ? "Done" : "Mark Done"}
                    </button>
                  </div>
                </div>

                <div ref={messagesContainerRef} className="flex-1 space-y-5 overflow-y-auto bg-white p-4 sm:p-6">
                  {selectedChat.messages.map((message, index) => {
                    const isOfficer = message.senderRole === "officer";

                    return (
                      <div
                        key={message._id || index}
                        className={`flex ${isOfficer ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[90%] rounded-2xl px-5 py-4 sm:max-w-[68%] ${
                            isOfficer
                              ? "rounded-br-md bg-blue-600 text-white"
                              : "rounded-bl-md bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm font-medium leading-6 sm:text-base">
                            {message.text}
                          </p>
                          <p
                            className={`mt-2 text-xs font-medium ${
                              isOfficer ? "text-blue-100" : "text-slate-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleReply} className="border-t border-slate-200 p-4 sm:p-6">
                  <div className="flex gap-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={1}
                      className="max-h-36 min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex h-14 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-20"
                    >
                      {sending ? (
                        <LuLoaderCircle className="h-5 w-5 animate-spin" />
                      ) : (
                        <LuSend className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <LuUser className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-black text-slate-900">Select a farmer</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Choose a conversation to view messages and reply.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
