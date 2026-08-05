import React, { useState } from 'react';
import { Bot, CheckCircle2, MoreHorizontal, Sparkles, Calendar, Check } from 'lucide-react';

interface AIAgentSectionProps {
  onOpenChat?: () => void;
  onScheduleTour?: () => void;
}

export const AIAgentSection: React.FC<AIAgentSectionProps> = ({ onOpenChat, onScheduleTour }) => {
  const [scheduled, setScheduled] = useState(false);

  const handleScheduleClick = () => {
    setScheduled(true);
    if (onScheduleTour) {
      onScheduleTour();
    }
    setTimeout(() => {
      setScheduled(false);
    }, 4000);
  };

  return (
    <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-zinc-200 rounded-[36px] p-8 sm:p-12 lg:p-16 card-shadow overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Typography & Features */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full text-xs font-bold text-zinc-700 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>AI-Powered Search</span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black leading-[1.05]">
                Talk to Your Personal Real Estate Agent
              </h2>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
                No more endless scrolling. Tell our AI agent your requirements—location, budget, vibe, and amenities. It will analyze thousands of listings in seconds and present a verified comparison.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-black">
                  DEEP PROPERTY INTELLIGENCE
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-black">
                  AUTOMATED LEGAL CHECKS
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-black">
                  TRANSPARENT RENT NEGOTIATION
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: AI Agent Chat Interface Card */}
          <div className="lg:col-span-7">
            <div className="bg-black border border-zinc-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl font-sans relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-display font-bold text-lg text-white leading-tight">
                      StayFinder Agent
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400 font-semibold">Online & Ready</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenChat}
                  className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Agent Options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Bubble Prompt */}
              <div className="my-5 flex justify-end">
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 italic px-5 py-3.5 rounded-2xl text-xs sm:text-sm max-w-lg shadow-inner">
                  "Find me a luxury PG in Indiranagar with high-speed WiFi and gym access under ₹25k."
                </div>
              </div>

              {/* Agent Analysis Box */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-5">
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold leading-relaxed">
                  UNDERSTOOD. I'VE ANALYZED 42 PROPERTIES. HERE'S A COMPARISON OF THE TOP 2 MATCHES:
                </p>

                {/* Comparison Table */}
                <div className="w-full text-xs font-mono">
                  <div className="grid grid-cols-3 pb-3 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <div>FEATURE</div>
                    <div>THE URBAN NEST</div>
                    <div>ZEN HEIGHTS</div>
                  </div>

                  <div className="grid grid-cols-3 py-3 border-b border-zinc-800/60 items-center">
                    <div className="text-zinc-300 font-sans font-medium">Rent</div>
                    <div className="font-bold text-emerald-400">₹23,500</div>
                    <div className="font-bold text-zinc-200">₹24,800</div>
                  </div>

                  <div className="grid grid-cols-3 py-3 border-b border-zinc-800/60 items-center">
                    <div className="text-zinc-300 font-sans font-medium">WiFi Speed</div>
                    <div className="text-zinc-300">300 Mbps</div>
                    <div className="font-bold text-emerald-400">1 Gbps</div>
                  </div>

                  <div className="grid grid-cols-3 py-3 items-center">
                    <div className="text-zinc-300 font-sans font-medium">AI Score</div>
                    <div className="text-zinc-300">94% Match</div>
                    <div className="font-bold text-emerald-400">98% Match</div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleScheduleClick}
                  className="w-full bg-white hover:bg-zinc-200 text-black py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {scheduled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>VIRTUAL TOUR REQUESTED!</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-black" />
                      <span>SCHEDULE VIRTUAL TOUR</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
