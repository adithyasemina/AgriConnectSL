"use client";

import { api } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LuLoader, LuSend } from "react-icons/lu";
import { initSocket, onChatNewMessage } from "@/lib/socket";

type OfficerChat = {
  _id: string;
  farmerId: string;
  farmerName: string;
  messages: Array<{
    senderId: string;
    senderName: string;
    senderRole: "farmer" | "officer";
    text: string;
    createdAt: string;
  }>;
  status: "open" | "done";
  assignedOfficerName?: string;
};

export default function ChatPage() {
  const [officerChat, setOfficerChat] = useState<OfficerChat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initSocket();
    fetchOfficerChat();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [officerChat?.messages]);

  useEffect(() => {
    // Listen for real-time messages
    const unsubscribe = onChatNewMessage((data) => {
      // Silent refetch to get fresh chat data
      fetchOfficerChat();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchOfficerChat = async () => {
    if (loading) return; // Prevent multiple simultaneous requests

    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/messages/farmer");
      const chats = response.data.chats || [];
      if (chats.length > 0) {
        setOfficerChat(chats[0]);
      } else {
        setOfficerChat(null);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load officer chat");
      setOfficerChat(null);
    } finally {
      setLoading(false);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setSending(true);
    try {
      await api.post("/api/messages", { text: messageText.trim() });
      setMessageText("");
      // Refetch to get the updated chat
      await fetchOfficerChat();
      toast.success("Message sent successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Chat Card */}
      <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Loading State */}
        {loading && !officerChat ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <LuLoader className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-slate-500">Loading officer chat...</p>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-red-600">{error}</p>
              <button
                onClick={fetchOfficerChat}
                className="text-sm text-blue-600 hover:text-blue-700 font-bold hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : officerChat && officerChat.messages.length > 0 ? (
          /* Messages Area */
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
              {officerChat.messages.map((message, index) => {
                const isOfficer = message.senderRole === "officer";

                return (
                  <div
                    key={`${message.createdAt}-${index}`}
                    className={`flex ${isOfficer ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-2xl px-5 py-4 ${
                        isOfficer
                          ? "rounded-bl-md bg-slate-100 text-slate-900"
                          : "rounded-br-md bg-blue-600 text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm font-medium leading-6 sm:text-base">
                        {message.text}
                      </p>
                      <p
                        className={`mt-2 text-xs font-medium ${
                          isOfficer ? "text-slate-500" : "text-blue-100"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-slate-200 bg-white p-4 sm:p-6 flex-shrink-0"
            >
              <div className="flex gap-3">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={2}
                  disabled={sending}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition sm:w-14"
                >
                  {sending ? (
                    <LuLoader className="h-5 w-5 animate-spin" />
                  ) : (
                    <LuSend className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-sm font-bold text-slate-900">No messages yet</p>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">
              Send a message to start a conversation with officers in your province.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
