"use client";

import { useState } from "react";

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  );
}

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
  sender: "farmer" | "officer";
  text: string;
  timestamp: string;
};

type Farmer = {
  id: number;
  name: string;
  email: string;
  lastMessage?: string;
};

const sampleFarmers: Farmer[] = [
  { id: 1, name: "Nimal Perera", email: "nimal@example.com" },
  { id: 2, name: "Saman Kumara", email: "saman@example.com" },
  { id: 3, name: "Kasun Silva", email: "kasun@example.com" },
  { id: 4, name: "Amal Fernando", email: "amal@example.com" },
  { id: 5, name: "Roshan Jayasekara", email: "roshan@example.com" },
];

const sampleMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      sender: "farmer",
      text: "Hi, I need help with my paddy field. The leaves are turning yellow.",
      timestamp: "2024-01-25 10:30",
    },
    {
      id: 2,
      sender: "officer",
      text: "Hello Nimal, yellow leaves could indicate nitrogen deficiency. Can you send me a photo?",
      timestamp: "2024-01-25 10:35",
    },
    {
      id: 3,
      sender: "farmer",
      text: "Sure, I'll send the photo tomorrow morning.",
      timestamp: "2024-01-25 10:40",
    },
  ],
  2: [
    {
      id: 1,
      sender: "farmer",
      text: "When is the best time to plant mango trees?",
      timestamp: "2024-01-24 14:20",
    },
    {
      id: 2,
      sender: "officer",
      text: "The best time is during the monsoon season, around May-June.",
      timestamp: "2024-01-24 14:25",
    },
  ],
  3: [
    {
      id: 1,
      sender: "farmer",
      text: "I'm interested in soil testing services.",
      timestamp: "2024-01-23 09:15",
    },
    {
      id: 2,
      sender: "officer",
      text: "Great! I can arrange a soil test for you. What's your preferred date?",
      timestamp: "2024-01-23 09:20",
    },
  ],
  4: [
    {
      id: 1,
      sender: "farmer",
      text: "Hi, I have questions about organic farming.",
      timestamp: "2024-01-22 11:00",
    },
  ],
  5: [
    {
      id: 1,
      sender: "farmer",
      text: "Can you recommend fertilizers for coconut?",
      timestamp: "2024-01-21 15:45",
    },
  ],
};

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState(1);
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState(sampleMessages);

  const filteredFarmers = sampleFarmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentMessages = messages[selectedFarmerId] || [];
  const selectedFarmer = sampleFarmers.find((f) => f.id === selectedFarmerId);

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setMessages({
      ...messages,
      [selectedFarmerId]: [
        ...currentMessages,
        {
          id: currentMessages.length + 1,
          sender: "officer",
          text: replyText,
          timestamp,
        },
      ],
    });

    setReplyText("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Messages
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Communicate with farmers
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col lg:flex-row h-[600px]">
        {/* Farmer List */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search farmers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredFarmers.map((farmer) => (
              <button
                key={farmer.id}
                onClick={() => setSelectedFarmerId(farmer.id)}
                className={`w-full px-4 py-3 text-left border-b border-slate-100 hover:bg-slate-50 transition ${
                  selectedFarmerId === farmer.id ? "bg-emerald-50" : ""
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white mb-2">
                  {farmer.name.charAt(0)}
                </div>
                <p className="font-bold text-slate-900 text-sm">{farmer.name}</p>
                <p className="text-xs text-slate-500">{farmer.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Panel */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedFarmer ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-200 p-4 sm:p-6">
                <h2 className="font-black text-slate-900">
                  {selectedFarmer.name}
                </h2>
                <p className="text-sm text-slate-500">{selectedFarmer.email}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "officer" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${
                        msg.sender === "officer"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "officer"
                            ? "text-white/70"
                            : "text-slate-500"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="border-t border-slate-200 p-4 sm:p-6">
                <div className="flex gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
                  />
                  <button
                    onClick={handleSendReply}
                    className="rounded-2xl bg-emerald-600 px-6 py-3 text-white font-black hover:bg-emerald-700 flex items-center justify-center min-w-fit"
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p className="text-sm">Select a farmer to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
