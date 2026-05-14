"use client";

import { useState } from "react";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "ආයුබෝවන් 👋 වී වගාවේ රෝග හා පළිබෝධ ගැන ප්‍රශ්නයක් අහන්න.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer || "පිළිතුරක් ලබාගත නොහැකි විය.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Server connection error.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        <div className="bg-green-700 text-white p-5 text-2xl font-bold text-center">
          AgriConnect Chatbot
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm">
                Typing...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ඔබගේ ප්‍රශ්නය type කරන්න..."
            className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-2xl font-semibold transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}