import React, { useState } from 'react';
import { X, MapPin, Phone, Star, Utensils, Wifi, BedDouble, ShieldCheck, Check, Calendar, Send, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { PGListing, Review, User } from '../types';
import { api } from '../api';

interface PGDetailModalProps {
  pg: PGListing | null;
  reviews: Review[];
  currentUser: User | null;
  onClose: () => void;
  onRefreshData: () => void;
  onReviewsChange: React.Dispatch<React.SetStateAction<Review[]>>;
  onOpenAuthModal: () => void;
  onBookSuccess: () => void;
}

export const PGDetailModal: React.FC<PGDetailModalProps> = ({
  pg,
  reviews,
  currentUser,
  onClose,
  onRefreshData,
  onReviewsChange,
  onOpenAuthModal,
  onBookSuccess,
}) => {
  if (!pg) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'book' | 'reviews'>('details');

  // Booking Form State
  const [fromDate, setFromDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => {
    const future = new Date();
    future.setMonth(future.getMonth() + 1);
    return future.toISOString().split('T')[0];
  });
  const [roomType, setRoomType] = useState<string>(pg.roomSharingType || 'Double');
  const [foodPref, setFoodPref] = useState<boolean>(pg.foodAvailability);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const images =
    pg.images && pg.images.length > 0
      ? pg.images
      : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'];

  const existingUserReview = currentUser ? reviews.find((r) => r.customer === currentUser._id) : null;

  // Handle Booking Submission
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (currentUser.role !== 'Customer') {
      setBookingMsg({ type: 'error', text: 'Only Customer accounts can book a PG. Please switch to a customer account.' });
      return;
    }

    setBookingLoading(true);
    setBookingMsg(null);

    const res = await api.bookPG({
      pgId: pg._id,
      fromDate,
      toDate,
      roomType,
      foodPreference: foodPref,
    });

    setBookingLoading(false);

    if (res.success) {
      setBookingMsg({ type: 'success', text: 'Booking request confirmed successfully!' });
      setTimeout(() => {
        onBookSuccess();
      }, 1200);
    } else {
      setBookingMsg({ type: 'error', text: res.message || 'Failed to complete booking.' });
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (!feedback.trim()) return;

    setReviewLoading(true);
    setReviewMessage(null);

    if (editingReviewId) {
      const res = await api.updateReview({ reviewId: editingReviewId, rating, feedback });
      setReviewLoading(false);

      if (res.success && res.data?.review) {
        onReviewsChange((prev) => prev.map((item) => (item._id === editingReviewId ? res.data.review : item)));
        setEditingReviewId(null);
        setFeedback('');
        setReviewMessage('Review updated successfully.');
      } else {
        setReviewMessage(res.message || 'Failed to update review.');
      }
    } else {
      const res = await api.addReview({ pgId: pg._id, rating, feedback });
      setReviewLoading(false);

      if (res.success && res.data?.review) {
        onReviewsChange((prev) => [res.data.review, ...prev]);
        setFeedback('');
        setReviewMessage('Review added successfully.');
      } else {
        setReviewMessage(res.message || 'Failed to post review.');
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    const res = await api.deleteReview(reviewId);

    if (res.success) {
      onReviewsChange((prev) => prev.filter((item) => item._id !== reviewId));
      setReviewMessage('Review deleted successfully.');
    } else {
      setReviewMessage(res.message || 'Failed to delete review.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-[32px] w-full max-w-4xl max-h-[92vh] flex flex-col card-shadow-lg overflow-hidden text-black">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-start justify-between bg-white/95 sticky top-0 z-10 backdrop-blur">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  pg.availabilityStatus === 'Available'
                    ? 'bg-black text-white border-black'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                }`}
              >
                {pg.availabilityStatus}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-black border border-zinc-200">
                {pg.genderPreference} Preference
              </span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-black">{pg.pgName}</h2>
            <p className="text-xs sm:text-sm text-zinc-500 italic flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-black shrink-0" />
              <span>
                {pg.location.address ? `${pg.location.address}, ` : ''}
                {pg.location.city}, {pg.location.state} • {pg.location.pincode}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery & View Selector */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Image Banner */}
          <div className="space-y-3">
            <div className="h-64 sm:h-80 w-full rounded-[24px] overflow-hidden bg-zinc-200 border border-zinc-200 relative">
              <img
                src={images[activeImgIndex]}
                alt={pg.pgName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-white/95 text-black px-4 py-2 rounded-2xl border border-zinc-200 font-bold text-xl card-shadow backdrop-blur">
                ₹{pg.price.toLocaleString()}{' '}
                <span className="text-xs font-normal text-zinc-500">/ month</span>
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`h-16 w-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImgIndex === idx ? 'border-black ring-2 ring-black/20' : 'border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-200 text-xs font-bold uppercase tracking-wider gap-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-black'
              }`}
            >
              Overview & Amenities
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === 'book'
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-black'
              }`}
            >
              Book Stay
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-black'
              }`}
            >
              <span>Reviews ({reviews.length})</span>
              <Star className="w-3.5 h-3.5 fill-black text-black" />
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-2">About this PG</h3>
                <p className="text-black text-sm leading-relaxed bg-zinc-100 p-4 rounded-2xl border border-zinc-200">
                  {pg.description || 'Clean and comfortable paying guest accommodation with flexible stay options.'}
                </p>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-100 p-3.5 rounded-2xl border border-zinc-200 text-xs">
                  <span className="text-zinc-500 block mb-1">Room Sharing</span>
                  <span className="font-bold text-black flex items-center gap-1">
                    <BedDouble className="w-4 h-4 text-black" /> {pg.roomSharingType} Sharing
                  </span>
                </div>

                <div className="bg-zinc-100 p-3.5 rounded-2xl border border-zinc-200 text-xs">
                  <span className="text-zinc-500 block mb-1">Food Service</span>
                  <span className="font-bold text-black flex items-center gap-1">
                    <Utensils className="w-4 h-4 text-black" />{' '}
                    {pg.foodAvailability ? 'Meals Included' : 'No Meals'}
                  </span>
                </div>

                <div className="bg-zinc-100 p-3.5 rounded-2xl border border-zinc-200 text-xs">
                  <span className="text-zinc-500 block mb-1">High-Speed Internet</span>
                  <span className="font-bold text-black flex items-center gap-1">
                    <Wifi className="w-4 h-4 text-black" />{' '}
                    {pg.wifiAvailability ? 'Wi-Fi Available' : 'No Wi-Fi'}
                  </span>
                </div>

                <div className="bg-zinc-100 p-3.5 rounded-2xl border border-zinc-200 text-xs">
                  <span className="text-zinc-500 block mb-1">Gender Pref</span>
                  <span className="font-bold text-black flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-black" /> {pg.genderPreference}
                  </span>
                </div>
              </div>

              {/* Amenities List */}
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">Included Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {(pg.amenities && pg.amenities.length > 0
                    ? pg.amenities
                    : ['24x7 Water Supply', 'Housekeeping', 'Geyser', 'Security']
                  ).map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-zinc-100 p-2.5 rounded-xl border border-zinc-200 text-black font-semibold"
                    >
                      <Check className="w-4 h-4 text-black shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Contact Box */}
              <div className="bg-zinc-100 p-4 rounded-2xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-500 block">Hosted by</span>
                  <span className="text-sm font-bold text-black">{pg.ownerName || 'Verified Stayfinder Host'}</span>
                </div>
                {pg.ownerPhone && (
                  <a
                    href={`tel:${pg.ownerPhone}`}
                    className="flex items-center gap-2 bg-black text-white border border-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{pg.ownerPhone}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BOOKING FORM */}
          {activeTab === 'book' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-zinc-100 p-6 rounded-[28px] border border-zinc-200 space-y-5">
                <h3 className="font-serif-display text-2xl font-bold text-black flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-black" />
                  <span>Reserve Stay at {pg.pgName}</span>
                </h3>

                {bookingMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                      bookingMsg.type === 'success'
                        ? 'bg-black text-white border-black'
                        : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleBookSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                        className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Check-out Date</label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                        className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Room Sharing Preference</label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black font-semibold"
                    >
                      <option value="Single">Single Room (Private)</option>
                      <option value="Double">Double Sharing</option>
                      <option value="Triple">Triple Sharing</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-zinc-200 text-xs">
                    <div>
                      <span className="font-bold text-black block">Include Daily Meals</span>
                      <span className="text-zinc-500 text-[11px]">Breakfast, Lunch & Dinner</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={foodPref}
                      onChange={(e) => setFoodPref(e.target.checked)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </div>

                  {/* Pricing Breakdown Box */}
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-600">
                      <span>Monthly Rent Base:</span>
                      <span className="text-black font-bold">₹{pg.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Maintenance & Security Deposit:</span>
                      <span className="text-black font-bold">Included</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-bold text-black">
                      <span>Total First Month:</span>
                      <span className="text-black">₹{pg.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading || pg.availabilityStatus === 'Not Available'}
                    className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-widest transition-all card-shadow disabled:opacity-50"
                  >
                    {bookingLoading ? 'Processing Booking...' : 'Confirm Stay Booking'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-zinc-100 p-3 rounded-2xl border border-zinc-200 text-[11px] text-zinc-500 italic">
                Reviews are created and updated against the backend correctly, but the backend does not yet expose a dedicated endpoint to fetch reviews by PG. This view can only show reviews already loaded in the current session.
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-center text-zinc-500 text-xs py-8 italic">
                    No reviews yet for this PG. Be the first customer to leave feedback!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="bg-zinc-100 p-4 rounded-2xl border border-zinc-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs">
                            {(rev.customerName || 'Customer').charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-black block">{rev.customerName || 'Verified Guest'}</span>
                            <span className="text-zinc-500 text-[10px]">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-white text-black px-2.5 py-1 rounded-full border border-zinc-200 font-bold">
                          <Star className="w-3 h-3 fill-black text-black" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>

                      <p className="text-black leading-relaxed pl-9 font-normal">{rev.feedback}</p>

                      {/* Customer Review Controls */}
                      {currentUser && rev.customer === currentUser._id && (
                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                          <button
                            onClick={() => {
                              setEditingReviewId(rev._id);
                              setRating(rev.rating);
                              setFeedback(rev.feedback);
                            }}
                            className="flex items-center gap-1 text-black hover:underline text-[11px] font-bold"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="flex items-center gap-1 text-zinc-600 hover:text-black text-[11px] font-bold"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add / Edit Review Form */}
              {currentUser && currentUser.role === 'Customer' && (!existingUserReview || editingReviewId) && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-zinc-100 p-5 rounded-[24px] border border-zinc-200 space-y-3"
                >
                  <h4 className="text-xs font-bold text-black uppercase tracking-widest">
                    {editingReviewId ? 'Edit Your Review' : 'Submit Review & Rating'}
                  </h4>

                  {reviewMessage && (
                    <div className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-[11px] font-semibold text-black">
                      {reviewMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-zinc-600 mb-1 font-bold">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setRating(num)}
                          className={`p-2 rounded-xl border transition-all ${
                            rating >= num
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-zinc-400 border-zinc-200'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${rating >= num ? 'fill-white' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-600 mb-1 font-bold">Feedback</label>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share details regarding cleanliness, food quality, Wi-Fi speed, or host behavior..."
                      required
                      className="w-full bg-white border border-zinc-200 text-black p-3 rounded-xl text-xs focus:outline-none focus:border-black font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    {editingReviewId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReviewId(null);
                          setFeedback('');
                          setReviewMessage(null);
                        }}
                        className="px-3.5 py-1.5 rounded-full text-xs border border-zinc-200 text-black bg-white hover:bg-zinc-100 font-bold"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all card-shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{editingReviewId ? 'Update Review' : 'Post Review'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
