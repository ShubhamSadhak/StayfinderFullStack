import React from 'react';
import { MapPin, Star, Utensils, Wifi, BedDouble, ChevronRight, Check, X } from 'lucide-react';
import { PGListing } from '../types';

interface PGCardProps {
  pg: PGListing;
  onSelect: (pg: PGListing) => void;
  onBook: (pg: PGListing) => void;
}

export const PGCard: React.FC<PGCardProps> = ({ pg, onSelect, onBook }) => {
  const primaryImg =
    pg.images && pg.images.length > 0
      ? pg.images[0]
      : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-[32px] border border-zinc-200 card-shadow hover:card-shadow-lg transition-all duration-300 flex flex-col group overflow-hidden">
      {/* Image Container with Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-200 cursor-pointer" onClick={() => onSelect(pg)}>
        <img
          src={primaryImg}
          alt={pg.pgName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Availability Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider backdrop-blur-md ${
              pg.availabilityStatus === 'Available'
                ? 'bg-black text-white border border-black'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}
          >
            {pg.availabilityStatus === 'Available' ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : (
              <X className="w-3 h-3 stroke-[3]" />
            )}
            <span>{pg.availabilityStatus}</span>
          </span>
        </div>

        {/* Gender Preference Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-zinc-200 card-shadow">
            {pg.genderPreference}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 text-black px-3 py-1 rounded-2xl border border-zinc-200 backdrop-blur-md card-shadow">
            <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">Rent / mo</span>
            <span className="text-base font-bold text-black">₹{pg.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Rating Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 text-black px-2.5 py-1 rounded-2xl border border-zinc-200 text-xs font-bold backdrop-blur-md card-shadow">
          <Star className="w-3.5 h-3.5 text-black fill-black" />
          <span>{pg.ratingAverage || 4.5}</span>
          <span className="text-zinc-500 text-[10px] font-normal">({pg.totalReviews || 0})</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelect(pg)}
            className="font-serif-display text-2xl font-bold text-black group-hover:text-zinc-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {pg.pgName}
          </h3>

          {/* Location */}
          <p className="text-xs text-zinc-500 italic flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
            <span>
              {pg.location.city}, {pg.location.state} • {pg.location.pincode}
            </span>
          </p>

          {/* Features / Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3 text-xs">
            {/* Room Sharing */}
            <span className="inline-flex items-center gap-1 bg-zinc-100 text-black px-2.5 py-1 rounded-full border border-zinc-200 text-[11px] font-semibold">
              <BedDouble className="w-3 h-3 text-black" />
              <span>{pg.roomSharingType} Room</span>
            </span>

            {/* Food */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                pg.foodAvailability
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200'
              }`}
            >
              <Utensils className="w-3 h-3" />
              <span>{pg.foodAvailability ? 'Food Inc.' : 'No Food'}</span>
            </span>

            {/* Wi-Fi */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                pg.wifiAvailability
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200'
              }`}
            >
              <Wifi className="w-3 h-3" />
              <span>{pg.wifiAvailability ? 'Wi-Fi' : 'No Wi-Fi'}</span>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-zinc-200 flex items-center justify-between gap-2">
          <div className="text-[11px] text-zinc-500 truncate">
            Host: <span className="text-black font-bold">{pg.ownerName || 'Verified Host'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(pg)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-200 text-black bg-white hover:bg-zinc-100 transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onBook(pg)}
              disabled={pg.availabilityStatus === 'Not Available'}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                pg.availabilityStatus === 'Available'
                  ? 'bg-black text-white hover:bg-zinc-800 card-shadow active:scale-95'
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <span>Book</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

