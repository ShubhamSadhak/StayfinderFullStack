import React from 'react';
import { Home } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-zinc-200 text-black py-8 px-4 sm:px-6 lg:px-8 text-xs mt-12 card-shadow">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Brand Section */}
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <span className="font-serif-display text-2xl font-bold text-black">Stayfinder</span>
          </div>
          <p className="text-zinc-600 leading-relaxed text-[11px] italic font-medium">
            Paying Guest (PG) discovery, booking, and management platform with verified owner listings & OTP authentication.
          </p>
        </div>

        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          <span>© 2026 Stayfinder. All rights reserved.</span>
          <span>Verified PG Accommodation Platform</span>
        </div>
      </div>
    </footer>
  );
};

