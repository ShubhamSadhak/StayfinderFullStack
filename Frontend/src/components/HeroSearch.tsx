import React, { useState } from 'react';
import { Search, MapPin, RotateCcw, Sparkles, ArrowRight, ShieldCheck, Star, Zap, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types';

interface HeroSearchProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const CITIES = ['All', 'Bengaluru', 'Pune', 'Delhi', 'Mumbai', 'Hyderabad'];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const isFiltered =
    filters.searchQuery ||
    filters.city !== 'All' ||
    filters.genderPreference !== 'all' ||
    filters.roomSharingType !== 'all' ||
    filters.foodAvailability !== 'all' ||
    filters.wifiAvailability !== 'all' ||
    filters.availabilityStatus !== 'all' ||
    filters.maxPrice < 20000;

  const scrollToSearch = () => {
    const el = document.getElementById('search-filter-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-b border-zinc-200 text-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Hero Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-2 pb-6">
          
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 bg-zinc-200/80 border border-zinc-300/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-zinc-700 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-zinc-800" />
              <span>AUTONOMOUS AI SEARCH NOW ACTIVE</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[1.08]">
              Find Your <br />
              <span className="font-extrabold">Premium PG</span>{' '}
              <span className="font-serif italic font-normal text-zinc-700">with</span>{' '}
              <span className="text-zinc-800">AI</span>
            </h1>

            {/* Subtext */}
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Experience the future of accommodation discovery. Our autonomous agents handle everything from property shortlisting to contract verification, ensuring a premium stay matched to your lifestyle.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={scrollToSearch}
                className="bg-[#3B424E] hover:bg-[#2D333E] text-white px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <span>Start AI Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToSearch}
                className="bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-95"
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Glass HUD Overlays */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[380px] sm:h-[460px] rounded-[32px] overflow-hidden shadow-2xl border border-zinc-200 group">
              
              {/* Penthouse Interior Image */}
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Studio Penthouse"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark Ambient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 pointer-events-none" />

              {/* Top Left Badge: Verified Security */}
              <div className="absolute top-5 left-5 z-10 flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Security</span>
              </div>

              {/* Middle Right Badge: Agent Rating */}
              <div className="absolute top-1/2 right-5 -translate-y-12 z-10 hidden sm:flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>4.9/5 Agent Rating</span>
              </div>

              {/* Floating Interactive Glass HUD Card (Left Overlay) */}
              <div className="absolute top-1/4 left-5 z-10 max-w-[250px] sm:max-w-[270px] bg-black/75 backdrop-blur-lg border border-white/20 text-white p-4 rounded-2xl shadow-2xl space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 border-b border-white/10 pb-1.5 uppercase tracking-wider font-bold">
                  <span>STAYFINDER - MIDNIGHT VARIATION</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif-display font-bold text-sm leading-tight text-white">
                    Obsidian Penthouse | 29FL
                  </h4>
                  <p className="text-[10px] text-zinc-300 font-mono">
                    AVAILABILITY: OCT 14 - DEC 12
                  </p>
                </div>

                <div className="pt-1 flex items-baseline justify-between border-t border-white/10">
                  <span className="font-bold text-sm text-white">₹18,500<span className="text-[10px] font-normal text-zinc-400">/month</span></span>
                  <button
                    onClick={scrollToSearch}
                    className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-md hover:bg-zinc-200 transition-colors"
                  >
                    BOOK NOW
                  </button>
                </div>

                <div className="text-[9px] text-zinc-400 space-y-0.5 pt-1">
                  <p>• High-Speed Wi-Fi, Weekly Cleaning</p>
                  <p>• Gym Access, Lift & Food</p>
                  <p className="text-zinc-300 font-semibold mt-1">Connaught Place, New Delhi</p>
                </div>
              </div>

              {/* Bottom Right Badge: AI Optimized Rent */}
              <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Optimized: -12% Rent</span>
              </div>

            </div>
          </div>

        </div>

        {/* Primary Search & Filter Bar Section */}
        <div id="search-filter-section" className="bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-200 card-shadow max-w-5xl mx-auto space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search PG name, city, landmark, or pincode..."
                value={filters.searchQuery}
                onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                className="w-full bg-zinc-100 text-black pl-11 pr-4 py-3 rounded-full border border-zinc-200 text-sm focus:ring-1 focus:ring-black outline-none placeholder-zinc-400"
              />
            </div>

            {/* City Selector */}
            <div className="relative w-full sm:w-56">
              <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-black" />
              <select
                value={filters.city}
                onChange={(e) => onFilterChange({ city: e.target.value })}
                className="w-full bg-zinc-100 text-black pl-10 pr-8 py-3 rounded-full border border-zinc-200 text-sm focus:ring-1 focus:ring-black outline-none font-medium cursor-pointer appearance-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Cities' : c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-4 py-3 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                showAdvancedFilters
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-100 text-black border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Quick City Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold whitespace-nowrap">
              Popular Cities:
            </span>
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => onFilterChange({ city: c })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filters.city === c
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-zinc-100 text-black border border-zinc-200 hover:bg-zinc-200'
                }`}
              >
                {c === 'All' ? 'All Cities' : c}
              </button>
            ))}
          </div>

          {/* Expandable Filter Controls */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t border-zinc-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs animate-fadeIn">
              {/* Gender Preference */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                  Gender
                </label>
                <select
                  value={filters.genderPreference}
                  onChange={(e) => onFilterChange({ genderPreference: e.target.value })}
                  className="w-full bg-zinc-100 text-black px-3 py-2 rounded-full border border-zinc-200 text-xs focus:ring-1 focus:ring-black outline-none font-medium"
                >
                  <option value="all">Any Gender</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              {/* Room Sharing Type */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                  Room Type
                </label>
                <select
                  value={filters.roomSharingType}
                  onChange={(e) => onFilterChange({ roomSharingType: e.target.value })}
                  className="w-full bg-zinc-100 text-black px-3 py-2 rounded-full border border-zinc-200 text-xs focus:ring-1 focus:ring-black outline-none font-medium"
                >
                  <option value="all">All Room Types</option>
                  <option value="Single">Single Sharing</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                </select>
              </div>

              {/* Food Availability */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                  Food
                </label>
                <select
                  value={filters.foodAvailability}
                  onChange={(e) => onFilterChange({ foodAvailability: e.target.value })}
                  className="w-full bg-zinc-100 text-black px-3 py-2 rounded-full border border-zinc-200 text-xs focus:ring-1 focus:ring-black outline-none font-medium"
                >
                  <option value="all">Food: Any</option>
                  <option value="yes">Food Included</option>
                  <option value="no">Self Catering</option>
                </select>
              </div>

              {/* Wi-Fi Availability */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                  Wi-Fi
                </label>
                <select
                  value={filters.wifiAvailability}
                  onChange={(e) => onFilterChange({ wifiAvailability: e.target.value })}
                  className="w-full bg-zinc-100 text-black px-3 py-2 rounded-full border border-zinc-200 text-xs focus:ring-1 focus:ring-black outline-none font-medium"
                >
                  <option value="all">Wi-Fi: Any</option>
                  <option value="yes">Wi-Fi Included</option>
                  <option value="no">No Wi-Fi</option>
                </select>
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                  Status
                </label>
                <select
                  value={filters.availabilityStatus}
                  onChange={(e) => onFilterChange({ availabilityStatus: e.target.value })}
                  className="w-full bg-zinc-100 text-black px-3 py-2 rounded-full border border-zinc-200 text-xs focus:ring-1 focus:ring-black outline-none font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="Available">Available Now</option>
                  <option value="Not Available">Full / Not Available</option>
                </select>
              </div>

              {/* Price Max Slider */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 flex justify-between">
                  <span>Max Rent</span>
                  <span className="text-black font-bold">₹{filters.maxPrice.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="25000"
                  step="500"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                  className="w-full accent-black cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Results Summary and Reset */}
          <div className="flex items-center justify-between text-xs pt-1 text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black">{totalResults}</span> verified properties found
            </div>

            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-black hover:underline font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};


