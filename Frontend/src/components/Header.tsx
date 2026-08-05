import React from 'react';
import { Home, User as UserIcon, Calendar, Building2, Plus, LogOut, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenBookingsModal: () => void;
  onOpenListingsModal: () => void;
  onOpenAddPGModal: () => void;
  onQuickLogin?: (email: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenBookingsModal,
  onOpenListingsModal,
  onOpenAddPGModal,
  onQuickLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 text-black card-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center card-shadow">
            <Home className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <span className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-black">
              Stayfinder
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black text-white font-bold border border-black">
              Verified PG
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              {/* Role Badge */}
              <div
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-zinc-300 bg-zinc-100 text-black"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>{currentUser.role === 'PG_Owner' ? 'PG Owner' : 'Customer'}</span>
              </div>

              {/* Owner Action: Add PG */}
              {currentUser.role === 'PG_Owner' && (
                <button
                  onClick={onOpenAddPGModal}
                  className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-full text-xs transition-all card-shadow active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Add Listing</span>
                </button>
              )}

              {/* Action Button: My Bookings or My Listings */}
              {currentUser.role === 'Customer' ? (
                <button
                  onClick={onOpenBookingsModal}
                  className="flex items-center gap-1.5 bg-white hover:bg-zinc-100 text-black border border-zinc-200 px-3.5 py-2 rounded-full text-xs font-bold transition-all card-shadow"
                >
                  <Calendar className="w-4 h-4 text-black" />
                  <span className="hidden sm:inline">My Bookings</span>
                </button>
              ) : (
                <button
                  onClick={onOpenListingsModal}
                  className="flex items-center gap-1.5 bg-white hover:bg-zinc-100 text-black border border-zinc-200 px-3.5 py-2 rounded-full text-xs font-bold transition-all card-shadow"
                >
                  <Building2 className="w-4 h-4 text-black" />
                  <span className="hidden sm:inline">My Listings</span>
                </button>
              )}

              {/* User Profile */}
              <button
                onClick={onOpenProfileModal}
                className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-black p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-zinc-200 text-xs font-semibold transition-all card-shadow"
              >
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all card-shadow active:scale-95"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

