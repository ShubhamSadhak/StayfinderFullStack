import React, { useState, useEffect } from 'react';
import { X, Building2, Plus, Edit3, Trash2, CheckCircle2, XCircle, Users, Calendar, Phone } from 'lucide-react';
import { Booking, PGListing } from '../types';
import { api } from '../api';

interface MyListingsModalProps {
  onClose: () => void;
  onOpenAddPG: () => void;
  onEditPG: (pg: PGListing) => void;
  onRefreshData: () => void;
}

export const MyListingsModal: React.FC<MyListingsModalProps> = ({
  onClose,
  onOpenAddPG,
  onEditPG,
  onRefreshData,
}) => {
  const [ownerPGs, setOwnerPGs] = useState<PGListing[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const [pgRes, bookRes] = await Promise.all([api.getAllPGs(), api.getBookings()]);

    if (pgRes.success && pgRes.data?.pgs) {
      // Get current user's PGs
      const userRes = await api.getCurrentUser();
      if (userRes.success && userRes.data?.user) {
        const userId = userRes.data.user._id;
        setOwnerPGs(pgRes.data.pgs.filter((p) => p.owner === userId));
      } else {
        setOwnerPGs([]);
      }
    } else {
      setOwnerPGs([]);
    }

    if (bookRes.success && bookRes.data?.bookings) {
      setIncomingBookings(bookRes.data.bookings);
    } else {
      setIncomingBookings([]);
    }

    if (!pgRes.success || !bookRes.success) {
      setError(pgRes.message || bookRes.message || 'Failed to load owner dashboard.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (pgId: string) => {
    if (!confirm('Are you sure you want to delete this PG listing permanently?')) return;
    const res = await api.deletePG(pgId);
    if (res.success) {
      fetchData();
      onRefreshData();
    } else {
      setError(res.message || 'Failed to delete PG listing.');
    }
  };

  const handleToggleStatus = async (pg: PGListing) => {
    const newStatus = pg.availabilityStatus === 'Available' ? 'Not Available' : 'Available';
    const res = await api.updatePG(pg._id, { ...pg, availabilityStatus: newStatus });
    if (res.success) {
      fetchData();
      onRefreshData();
    } else {
      setError(res.message || 'Failed to update listing status.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-[32px] w-full max-w-4xl max-h-[90vh] flex flex-col card-shadow-lg overflow-hidden text-black">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-black">PG Owner Dashboard</h2>
              <p className="text-xs text-zinc-500">Manage properties, availability, and tenant booking requests</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddPG}
              className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all card-shadow"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add PG</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 flex border-b border-zinc-200 text-xs font-bold uppercase tracking-wider gap-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'listings' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            My PG Properties ({ownerPGs.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            <span>Tenant Bookings ({incomingBookings.length})</span>
            <Users className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="bg-black text-white border border-black p-3 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-center text-zinc-500 text-xs py-10">Loading property records...</p>
          ) : activeTab === 'listings' ? (
            ownerPGs.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Building2 className="w-10 h-10 text-zinc-300 mx-auto" />
                <p className="text-zinc-600 text-sm font-medium">You haven't added any PG listings yet.</p>
                <button
                  onClick={onOpenAddPG}
                  className="bg-black text-white hover:bg-zinc-800 font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider card-shadow"
                >
                  Create Your First Listing
                </button>
              </div>
            ) : (
              ownerPGs.map((pg) => (
                <div
                  key={pg._id}
                  className="bg-white p-4.5 rounded-2xl border border-zinc-200 card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                          pg.availabilityStatus === 'Available'
                            ? 'bg-black text-white border-black'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200 line-through'
                        }`}
                      >
                        {pg.availabilityStatus}
                      </span>
                      <span className="text-black font-bold font-serif-display text-base">₹{pg.price.toLocaleString()} / mo</span>
                    </div>

                    <h3 className="font-serif-display text-xl font-bold text-black">{pg.pgName}</h3>
                    <p className="text-zinc-500">
                      {pg.location.city}, {pg.location.state} • {pg.genderPreference} Preference • {pg.roomSharingType} Sharing
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200">
                    <button
                      onClick={() => handleToggleStatus(pg)}
                      className="px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 text-black font-bold uppercase tracking-wider text-[10px]"
                    >
                      {pg.availabilityStatus === 'Available' ? 'Mark Full' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => onEditPG(pg)}
                      className="p-2 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 text-black"
                      title="Edit PG"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pg._id)}
                      className="p-2 rounded-full border border-black bg-black text-white hover:bg-zinc-800"
                      title="Delete PG"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : incomingBookings.length === 0 ? (
            <p className="text-center text-zinc-500 text-xs py-10">No tenant bookings received yet.</p>
          ) : (
            incomingBookings.map((b) => {
              const pg = typeof b.pg === 'object' ? b.pg : b.pgDetails;
              return (
                <div
                  key={b._id}
                  className="bg-white p-4.5 rounded-2xl border border-zinc-200 card-shadow space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-serif-display text-lg font-bold text-black">{pg?.pgName || 'PG Listing'}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border uppercase ${
                        b.bookingStatus === 'Confirmed'
                          ? 'bg-black text-white border-black'
                          : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-600 bg-zinc-100 p-3 rounded-2xl border border-zinc-200 font-semibold">
                    <div>
                      Tenant:{' '}
                      <span className="font-bold text-black">{b.customerName || 'Rahul Sharma'}</span>
                    </div>
                    <div>
                      Phone:{' '}
                      <span className="font-bold text-black">{b.customerPhone || '+91 9876543210'}</span>
                    </div>
                    <div>
                      Stay Dates:{' '}
                      <span className="font-bold text-black">
                        {b.fromDate} to {b.toDate}
                      </span>
                    </div>
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
