import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

interface UpgradeCTAProps {
  onGetStarted?: () => void;
  onScheduleDemo?: () => void;
}

export const UpgradeCTA: React.FC<UpgradeCTAProps> = ({
  onGetStarted,
  onScheduleDemo,
}) => {
  return (
    <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-black text-white border border-zinc-800 rounded-[32px] sm:rounded-[36px] p-8 sm:p-14 md:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Ready to upgrade your living experience?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base md:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and professionals who found their dream PG with StayFinder AI.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              if (onGetStarted) {
                onGetStarted();
              } else {
                const el = document.getElementById('search-filter-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onScheduleDemo}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 px-8 py-3.5 rounded-full font-bold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule a Demo</span>
          </button>
        </div>
      </div>
    </section>
  );
};
