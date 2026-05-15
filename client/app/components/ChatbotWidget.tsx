"use client";

import { useState, useRef, useEffect } from "react";
import { LuMessageCircle, LuX, LuSend } from "react-icons/lu";
import { api } from "@/lib/api";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm the AgriConnect assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/chatbot", {
        question: inputValue,
      });

      const botReply = response.data.answer || response.data.response || "Sorry, I could not understand that.";

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botReply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "Sorry, I could not connect to the chatbot service. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-10 right-10 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label="Open chatbot"
      >
        <LuMessageCircle size={24} />
      </button>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] items-end justify-end sm:h-auto sm:w-auto sm:bottom-8 sm:right-8 sm:items-start sm:justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup */}
          <div className="relative z-50 flex h-full w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:h-[600px] sm:w-96 sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white sm:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <LuMessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold">AgriConnect Bot</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 transition hover:bg-white/20"
                aria-label="Close chatbot"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-900 border border-slate-200"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.1s]"></div>
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 bg-white p-4 sm:rounded-b-2xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <LuSend size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
