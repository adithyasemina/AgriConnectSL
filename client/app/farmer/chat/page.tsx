"use client";

import { useState } from "react";

function SendIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );
}

type Message = {
  id: number;
  sender: "farmer" | "bot" | "officer";
  text: string;
  timestamp: string;
};

const botMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    text: "Hello! I'm the AgriConnect AI Assistant. How can I help you with your farming today?",
    timestamp: "2024-01-25 10:00",
  },
  {
    id: 2,
    sender: "farmer",
    text: "My paddy leaves are turning yellow. What could be the issue?",
    timestamp: "2024-01-25 10:05",
  },
  {
    id: 3,
    sender: "bot",
    text: "Yellow leaves on paddy can be caused by several issues:\n1. Nitrogen deficiency - most common\n2. Iron deficiency\n3. Diseases like blast or sheath blight\n\nTry uploading an image in the Find Disease section for accurate identification!",
    timestamp: "2024-01-25 10:06",
  },
];

const officerMessages: Message[] = [
  {
    id: 1,
    sender: "officer",
    text: "Hi! This is Officer Saman. How can I assist you today?",
    timestamp: "2024-01-25 09:30",
  },
  {
    id: 2,
    sender: "farmer",
    text: "Hello officer, I need advice on soil testing. When is the best time?",
    timestamp: "2024-01-25 09:35",
  },
  {
    id: 3,
    sender: "officer",
    text: "Great question! Soil testing should be done before planting season. I can schedule a test for you next week. Would that work?",
    timestamp: "2024-01-25 09:40",
  },
  {
    id: 4,
    sender: "farmer",
    text: "That sounds perfect. Tuesday afternoon would be good.",
    timestamp: "2024-01-25 09:45",
  },
  {
    id: 5,
    sender: "officer",
    text: "Perfect! I've scheduled your soil test for Tuesday at 2:00 PM. Our team will visit your field.",
    timestamp: "2024-01-25 09:50",
  },
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<"bot" | "officer">("bot");
  const [messageText, setMessageText] = useState("");
  const [botMsgs, setBotMsgs] = useState<Message[]>(botMessages);
  const [officerMsgs, setOfficerMsgs] = useState<Message[]>(officerMessages);

  const currentMessages =
    activeTab === "bot" ? botMsgs : officerMsgs;

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newMessage: Message = {
      id: currentMessages.length + 1,
      sender: "farmer",
      text: messageText,
      timestamp,
    };

    if (activeTab === "bot") {
      setBotMsgs([...botMsgs, newMessage]);

      setTimeout(() => {
        const botReply: Message = {
          id: currentMessages.length + 2,
          sender: "bot",
          text: "Thanks for your message! I'm here to help. For more specific issues, please feel free to chat with our officers.",
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setBotMsgs((prev) => [...prev, botReply]);
      }, 500);
    } else {
      setOfficerMsgs([...officerMsgs, newMessage]);
    }

    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Chat Support
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Connect with AI assistance or chat with our officers
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab("bot")}
            className={`flex-1 px-6 py-4 text-sm font-bold transition ${
              activeTab === "bot"
                ? "border-b-2 border-emerald-600 text-emerald-600 bg-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            AI Chatbot
          </button>
          <button
            onClick={() => setActiveTab("officer")}
            className={`flex-1 px-6 py-4 text-sm font-bold transition ${
              activeTab === "officer"
                ? "border-b-2 border-emerald-600 text-emerald-600 bg-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Officer Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "farmer" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${
                  message.sender === "farmer"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "farmer"
                      ? "text-white/70"
                      : "text-slate-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex gap-3">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={3}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-white font-black hover:bg-emerald-700 flex items-center justify-center min-w-fit transition"
            >
              <SendIcon />
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
