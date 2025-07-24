import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Append user message
    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setInput('');

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Thanks for your message. We\'ll assist you shortly!' },
      ]);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-md hover:scale-105 transition z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[90%] h-[500px] bg-base-100 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden">
          <div className="bg-primary text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">PrintSprint AI</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-xl leading-none">&times;</button>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat ${msg.from === 'user' ? 'chat-end' : 'chat-start'}`}
              >
                <div className={`chat-bubble ${msg.from === 'user' ? 'chat-bubble-primary' : 'chat-bubble-accent'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex items-center border-t p-2 bg-base-200">
            <input
              type="text"
              placeholder="Type a message..."
              className="input input-sm w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSend} className="btn btn-sm btn-primary ml-2">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;
