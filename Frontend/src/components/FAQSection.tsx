import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Bot, TrendingUp, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'ai_growth';
}

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('1');
  const [activeCategory, setActiveCategory] = useState<'all' | 'booking' | 'ai_growth'>('all');

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'booking',
      question: "How do I search and book a PG stay on Stayfinder?",
      answer: "Simply use our top search bar to select your city (e.g. Bengaluru, Pune, Delhi), filter by gender preference (Male, Female, Unisex), room sharing type, and food inclusion. Once you find a PG card you like, click 'View Details' or 'Book Stay' to submit your request directly to the verified owner."
    },
    {
      id: '2',
      category: 'ai_growth',
      question: "What are the key benefits of AI in growing a PG accommodation business?",
      answer: "StayFinder AI accelerates your business growth through 24/7 automated inquiry handling, instant room-matching based on university & office proximity, intelligent price optimization during peak college admission seasons, and zero-spam OTP tenant verification."
    },
    {
      id: '3',
      category: 'booking',
      question: "Is mobile OTP verification required for signing up?",
      answer: "Yes! Stayfinder incorporates real-time SMS OTP authentication (powered by Twilio Verify backend) to ensure that all tenant profiles and PG host listings are 100% genuine and verified, preventing fraudulent listings or fake inquiries."
    },
    {
      id: '4',
      category: 'ai_growth',
      question: "How does the StayFinder AI Agent help boost PG room occupancy?",
      answer: "Our built-in AI Assistant engages potential tenants immediately as they land on the platform, answering specific questions about WiFi speeds, meal plans, deposit refunds, and landmark distances in seconds—converting browsing visitors into booked tenants without host delay."
    },
    {
      id: '5',
      category: 'booking',
      question: "Can PG hosts manage multiple properties and track booking requests?",
      answer: "Absolutely. PG Hosts can register an owner account, add unlimited properties with custom photos, amenities, and pricing, and manage pending or approved tenant booking requests directly from their Owner Dashboard."
    },
    {
      id: '6',
      category: 'ai_growth',
      question: "How does smart AI location & price matching improve tenant satisfaction?",
      answer: "Instead of endless scrolling, our intelligent algorithms recommend PGs based on strict lifestyle filters (e.g., vegetarian meal plans, AC single rooms, attached bath, near metro lines), leading to longer tenant stays and positive host reviews."
    }
  ];

  const aiGrowthHighlights = [
    {
      icon: <Bot className="w-5 h-5 text-emerald-600" />,
      title: "24/7 AI Tenant Assistant",
      description: "Automate responses to frequent tenant queries about rent, deposits, and room availability to never miss a potential booking."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      title: "3x Faster Occupancy Conversion",
      description: "Smart preference matching pairs students and IT professionals with their ideal PG stays in seconds."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      title: "Verified Trust & OTP Security",
      description: "Shield your property from spam inquiries with mandatory phone OTP registration and host identity verification."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      title: "Dynamic Revenue Optimization",
      description: "Capitalize on seasonal university intake and IT hiring surges with smart pricing recommendations."
    }
  ];

  const filteredFaqs = faqs.filter(faq => activeCategory === 'all' || faq.category === activeCategory);

  return (
    <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white p-8 sm:p-12 rounded-[32px] border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Got Questions? We've Got Answers</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            We've Got The Answers You're Looking For
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Discover how Stayfinder simplifies PG discovery for tenants while delivering the key benefits of AI to supercharge your PG business growth and occupancy rates.
          </p>
        </div>
      </div>

      {/* AI Business Growth Highlights Banner */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Business Intelligence</span>
            <h3 className="font-serif-display text-2xl font-bold text-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-black" />
              Key Benefits of AI in Your Business Growth
            </h3>
          </div>
          <span className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
            Stayfinder AI Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiGrowthHighlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 p-5 rounded-2xl hover:border-black transition-all card-shadow flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-black">{item.title}</h4>
                <p className="text-zinc-600 text-xs leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified AI Advantage</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion FAQ Container */}
      <div className="bg-white border border-zinc-200 rounded-[32px] p-6 sm:p-8 card-shadow space-y-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-black" />
            <h3 className="font-serif-display font-bold text-xl text-black">Frequently Asked Questions</h3>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-full border border-zinc-200 text-xs font-bold">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeCategory === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              All FAQs
            </button>
            <button
              onClick={() => setActiveCategory('booking')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeCategory === 'booking'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              PG & Booking
            </button>
            <button
              onClick={() => setActiveCategory('ai_growth')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeCategory === 'ai_growth'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              AI & Business Growth
            </button>
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isOpen ? 'border-black bg-zinc-50/80 shadow-xs' : 'border-zinc-200 hover:border-zinc-400 bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-black cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {faq.category === 'ai_growth' ? (
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200/60 font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
