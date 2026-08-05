import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2, User, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  options?: string[];
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm your StayFinder AI Assistant. Looking for a PG near your university or work hub?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        'Single room near IIT Delhi',
        'PGs with 3x meals included',
        'Budget PGs under ₹10,000/mo',
        'How do I list my property?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      let responseText = "I found several verified PG options matching your query! You can use our top search filters or explore detailed amenities on each property card.";
      let nextOptions: string[] | undefined = undefined;

      const lower = query.toLowerCase();
      if (lower.includes('iit delhi') || lower.includes('delhi') || lower.includes('single')) {
        responseText = "Analyzing verified properties near IIT Delhi... We have 'Starlight Executive PG' and 'Green Park Co-Living' offering single sharing rooms starting at ₹12,000/mo with high-speed Wi-Fi and 3x meals.";
        nextOptions = ['View Starlight Executive PG', 'Check female-only PGs in Delhi'];
      } else if (lower.includes('food') || lower.includes('meals')) {
        responseText = "Over 80% of Stayfinder PGs include daily hygienic meals (Breakfast, Lunch & Dinner). Look for the 'Food Included' tag on listings!";
        nextOptions = ['Show PGs with food in Bengaluru', 'Show PGs with food in Pune'];
      } else if (lower.includes('10,000') || lower.includes('budget') || lower.includes('under')) {
        responseText = "Great! You can filter listings by budget using our price slider or search bar. Several double and triple sharing PGs start from ₹7,500/mo.";
        nextOptions = ['Filter under ₹10k', 'Check Bengaluru budget PGs'];
      } else if (lower.includes('list') || lower.includes('property') || lower.includes('owner')) {
        responseText = "To list your PG property, simply click 'Sign In' -> Register as a 'PG Owner', and access your PG Owner Dashboard to publish verified rooms!";
        nextOptions = ['How OTP verification works', 'What are host fees?'];
      } else if (lower.includes('otp') || lower.includes('verification')) {
        responseText = "Stayfinder integrates real-time SMS OTP verification (powered by Twilio Verify) during signup to ensure zero spam and 100% verified tenant profiles!";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: nextOptions
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Animated Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-black hover:bg-zinc-800 text-white p-4 rounded-full shadow-2xl flex items-center gap-2.5 border border-zinc-700 cursor-pointer group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline pr-1">AI Assistant</span>
        </motion.button>
      )}

      {/* Animated Chat Box Pop-Up */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[90vw] sm:w-[380px] h-[520px] bg-white border border-zinc-300 rounded-[28px] shadow-2xl flex flex-col overflow-hidden text-black font-sans"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-base leading-tight">StayFinder AI Agent</h3>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Online & Ready</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
                title="Minimize Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50 text-xs">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-black text-white rounded-br-none shadow-sm'
                        : 'bg-white text-black border border-zinc-200 rounded-bl-none shadow-sm font-medium'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-zinc-400 mt-1 font-semibold px-1">{msg.time}</span>

                  {/* Quick Action Chips if present */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="bg-white hover:bg-black hover:text-white border border-zinc-300 text-black px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-xs"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-white border border-zinc-200 p-3 rounded-2xl rounded-bl-none w-max text-zinc-500 italic font-medium"
                >
                  <span>StayFinder AI is typing</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                  </span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about PGs, locations..."
                className="flex-1 bg-zinc-100 border border-zinc-200 text-black px-3.5 py-2.5 rounded-full text-xs font-semibold focus:outline-none focus:border-black focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-black hover:bg-zinc-800 disabled:opacity-40 text-white p-2.5 rounded-full transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
