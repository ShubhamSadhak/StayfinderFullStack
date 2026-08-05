import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, AlertCircle, Ban, CheckCircle2, Clock } from 'lucide-react';
import { Booking } from '../types';
import { api } from '../api';

interface MyBookingsModalProps {
  onClose: () => void;
  onSelectPG: (pgId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ onClose, onSelectPG }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    const res = await api.getBookings();
    if (res.success && res.data?.bookings) {
      setBookings(res.data.bookings);
    } else {
      setBookings([]);
      setError(res.message || 'Failed to load bookings.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    const res = await api.cancelBooking(bookingId);
    setCancellingId(null);
    if (res.success) {
      fetchBookings();
    } else {
      setError(res.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col card-shadow-lg overflow-hidden text-black">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-black">My Stay Bookings</h2>
              <p className="text-xs text-zinc-500">Track active reservations and cancellation history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="bg-black text-white border border-black p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <p className="text-center text-zinc-500 text-xs py-10">Loading your stay bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Calendar className="w-10 h-10 text-zinc-300 mx-auto" />
              <p className="text-zinc-600 text-sm font-medium">You have not booked any PGs yet.</p>
            </div>
          ) : (
            bookings.map((b) => {
              const pg = typeof b.pg === 'object' ? b.pg : b.pgDetails;
              return (
                <div
                  key={b._id}
                  className="bg-white p-4.5 rounded-2xl border border-zinc-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border flex items-center gap-1 ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-black text-white border-black'
                            : b.bookingStatus === 'Cancelled'
                            ? 'bg-zinc-100 text-zinc-500 border-zinc-200 line-through'
                            : 'bg-zinc-100 text-black border-zinc-200'
                        }`}
                      >
                        {b.bookingStatus === 'Confirmed' ? (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        ) : b.bookingStatus === 'Cancelled' ? (
                          <Ban className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{b.bookingStatus}</span>
                      </span>

                      <span className="text-zinc-400 text-[10px]">Booking ID: {b._id}</span>
                    </div>

                    <h3
                      onClick={() => pg && onSelectPG(pg._id)}
                      className="font-serif-display text-xl font-bold text-black hover:underline cursor-pointer transition-colors"
                    >
                      {pg?.pgName || 'PG Listing'}
                    </h3>

                    {pg?.location && (
                      <p className="text-zinc-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>
                          {pg.location.city}, {pg.location.state}
                        </span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-1 text-zinc-600">
                      <div>
                        Dates:{' '}
                        <span className="font-semibold text-black">
                          {b.fromDate} to {b.toDate}
                        </span>
                      </div>
                      <div>
                        Room:{' '}
                        <span className="font-semibold text-black">{b.roomType} Sharing</span>
                      </div>
                      <div>
                        Food:{' '}
                        <span className="font-semibold text-black">
                          {b.foodPreference ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-200">
                    <div className="text-right">
                      <span className="text-zinc-400 block text-[10px] uppercase tracking-wider font-bold">Monthly Rent</span>
                      <span className="text-lg font-bold font-serif-display text-black">
                        ₹{(b.totalAmount || pg?.price || 0).toLocaleString()}
                      </span>
                    </div>

                    {b.bookingStatus !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={cancellingId === b._id}
                        className="flex items-center gap-1 bg-black text-white hover:bg-zinc-800 border border-black px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] transition-all active:scale-95"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{cancellingId === b._id ? 'Cancelling...' : 'Cancel Stay'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
