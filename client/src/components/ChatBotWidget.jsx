import React, { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import Linkify from "react-linkify";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const flaskApiUrl = "http://localhost:5000"; // Flask backend URL

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setLoading(true);
      fetch(`${flaskApiUrl}/welcome`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setMessages([
            { from: "bot", text: data.response },
            { from: "bot", text: "Hi! How can I help you today?" },
          ]);
        })
        .catch((error) => {
          console.error("Error fetching welcome message:", error);
          setMessages([
            {
              from: "bot",
              text: "Welcome to PaperSprint! (Failed to connect to backend, using default message)",
            },
            { from: "bot", text: "Hi! How can I help you today?" },
          ]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${flaskApiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.response || "No response from AI" },
      ]);
    } catch (err) {
      console.error("Error sending message to AI:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Failed to connect to AI server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  // Link decorator for styling links
  const linkDecorator = (decoratedHref, decoratedText, key) => (
    <a
      href={decoratedHref}
      key={key}
      className="text-blue-400 underline hover:text-blue-300"
    >
      {decoratedText}
    </a>
  );

  return (
    <div className="font-inter">
      {/* Toggle Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90%] h-[500px] bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-3 flex justify-between items-center shadow-md rounded-t-lg">
            <span className="font-semibold text-lg">PaperSprint AI</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl leading-none hover:text-gray-200 transition-colors focus:outline-none"
              aria-label="Close Chat"
            >
              &times;
            </button>
          </div>

          {/* Messages Display Area */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm bg-gray-900 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <Linkify componentDecorator={linkDecorator}>
                    {msg.text}
                  </Linkify>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg shadow-md bg-gray-700 text-gray-100 rounded-bl-none">
                  <div className="flex items-center">
                    <span className="animate-pulse mr-2">...</span> Thinking
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Area */}
          <div className="flex items-center border-t border-gray-700 p-3 bg-gray-800">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className="ml-2 px-5 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
