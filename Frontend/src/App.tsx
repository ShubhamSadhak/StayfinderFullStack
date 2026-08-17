import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { PGCard } from './components/PGCard';
import { PGDetailModal } from './components/PGDetailModal';
import { AddEditPGModal } from './components/AddEditPGModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { MyListingsModal } from './components/MyListingsModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { FAQSection } from './components/FAQSection';
import { AIAgentSection } from './components/AIAgentSection';
import { ExpandingAcrossIndia } from './components/ExpandingAcrossIndia';
import { UpgradeCTA } from './components/UpgradeCTA';
import { FilterState, PGListing, Review, User } from './types';
import { api, AUTH_EXPIRED_EVENT, setAuthToken } from './api';
import { Sparkles, Building2, SearchX, CheckCircle2, AlertCircle } from 'lucide-react';

const fallbackPGs: PGListing[] = [
  {
    _id: 'demo-1',
    pgName: 'The Cozy Nest',
    owner: 'Demo Host',
    ownerName: 'Amit Verma',
    ownerPhone: '9876543210',
    location: {
      state: 'Karnataka',
      city: 'Bangalore',
      pincode: '560001',
      address: 'MG Road, near Metro Station',
    },
    price: 8500,
    foodAvailability: true,
    wifiAvailability: true,
    genderPreference: 'Male',
    roomSharingType: 'Single',
    availabilityStatus: 'Available',
    description: 'Bright and secure single-room PG close to offices.',
    amenities: ['AC', 'Locker', 'Housekeeping'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
    ratingAverage: 4.8,
    totalReviews: 32,
  },
  {
    _id: 'demo-2',
    pgName: 'City Lights PG',
    owner: 'Demo Host',
    ownerName: 'Priya Sharma',
    ownerPhone: '9123456780',
    location: {
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
      address: 'Colaba Causeway, near Colaba',
    },
    price: 10500,
    foodAvailability: false,
    wifiAvailability: true,
    genderPreference: 'Unisex',
    roomSharingType: 'Double',
    availabilityStatus: 'Available',
    description: 'Modern PG in the heart of the city with high-speed Wi-Fi.',
    amenities: ['Wifi', 'Common Lounge', '24x7 Water'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    ratingAverage: 4.6,
    totalReviews: 21,
  },
  {
    _id: 'demo-3',
    pgName: 'Green Court Residency',
    owner: 'Demo Host',
    ownerName: 'Rahul Gupta',
    ownerPhone: '9988776655',
    location: {
      state: 'Tamil Nadu',
      city: 'Chennai',
      pincode: '600028',
      address: 'Anna Nagar West, near bus stand',
    },
    price: 7800,
    foodAvailability: true,
    wifiAvailability: false,
    genderPreference: 'Female',
    roomSharingType: 'Triple',
    availabilityStatus: 'Available',
    description: 'Comfortable shared rooms for students and young professionals.',
    amenities: ['Power Backup', 'Laundry', 'Housekeeping'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'],
    ratingAverage: 4.7,
    totalReviews: 18,
  },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pgs, setPgs] = useState<PGListing[]>([]);
  const [selectedPG, setSelectedPG] = useState<PGListing | null>(null);
  const [selectedPGReviews, setSelectedPGReviews] = useState<Review[]>([]);
  const [loadingPGs, setLoadingPGs] = useState(true);
  const [pgError, setPgError] = useState<string | null>(null);

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showListingsModal, setShowListingsModal] = useState(false);
  const [showAddEditPGModal, setShowAddEditPGModal] = useState(false);
  const [editingPG, setEditingPG] = useState<PGListing | null>(null);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    city: 'All',
    state: 'All',
    genderPreference: 'all',
    roomSharingType: 'all',
    foodAvailability: 'all',
    wifiAvailability: 'all',
    availabilityStatus: 'all',
    minPrice: 0,
    maxPrice: 20000,
    searchQuery: '',
  });

  // Fetch Current User
  const refreshCurrentUser = async () => {
    const res = await api.getCurrentUser();
    if (res.success && res.data?.user) {
      setCurrentUser(res.data.user);
    } else {
      setCurrentUser(null);
    }
  };

  // Fetch PGs List
  const refreshPGs = async () => {
    setLoadingPGs(true);
    setPgError(null);
    const res = await api.getAllPGs();
    if (res.success && res.data?.pgs) {
      setPgs(res.data.pgs);
    } else {
      setPgs(fallbackPGs);
      setPgError(res.message || 'Unable to load PG listings right now. Showing a few sample stays.');
    }
    setLoadingPGs(false);
  };

  // Fetch PG Detail + Reviews
  const loadPGDetail = async (pgId: string) => {
    const res = await api.getPGById(pgId);
    if (res.success && res.data?.pg) {
      setSelectedPG(res.data.pg);
      setSelectedPGReviews(res.data.reviews || []);
    } else {
      showToast(res.message || 'Unable to load PG details.');
    }
  };

  useEffect(() => {
    refreshCurrentUser();
    refreshPGs();
  }, []);

  useEffect(() => {
    const handleAuthExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;

      setCurrentUser(null);
      setSelectedPG(null);
      setSelectedPGReviews([]);
      setShowProfileModal(false);
      setShowBookingsModal(false);
      setShowListingsModal(false);
      setShowAddEditPGModal(false);
      setEditingPG(null);
      setShowAuthModal(true);
      showToast(customEvent.detail?.message || 'Your session has expired. Please log in again.');
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired as EventListener);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired as EventListener);
    };
  }, []);

  // Quick Demo Login
  const handleQuickLogin = async (email: string) => {
    const res = await api.login({ email, password: 'password123' });
    if (res.success && res.data?.accessToken) {
      setAuthToken(res.data.accessToken);
      setCurrentUser(res.data.user);
      showToast(`Logged in as ${res.data.user.name} (${res.data.user.role})`);
      refreshPGs();
    } else {
      showToast(res.message || 'Quick login failed.');
    }
  };

  // Logout
  const handleLogout = async () => {
    await api.logout();
    setAuthToken(null);
    setCurrentUser(null);
    setShowProfileModal(false);
    setShowBookingsModal(false);
    setShowListingsModal(false);
    showToast('Logged out successfully.');
    refreshPGs();
  };

  // Filter Logic
  const filteredPGs = useMemo(() => {
    return pgs.filter((pg) => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = pg.pgName.toLowerCase().includes(q);
        const matchCity = pg.location.city.toLowerCase().includes(q);
        const matchState = pg.location.state.toLowerCase().includes(q);
        const matchPin = pg.location.pincode.toLowerCase().includes(q);
        const matchAddr = pg.location.address?.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchState && !matchPin && !matchAddr) return false;
      }

      // City filter
      if (filters.city !== 'All' && pg.location.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Gender filter
      if (filters.genderPreference !== 'all' && pg.genderPreference !== filters.genderPreference) {
        return false;
      }

      // Room type filter
      if (filters.roomSharingType !== 'all' && pg.roomSharingType !== filters.roomSharingType) {
        return false;
      }

      // Food filter
      if (filters.foodAvailability === 'yes' && !pg.foodAvailability) return false;
      if (filters.foodAvailability === 'no' && pg.foodAvailability) return false;

      // Wi-Fi filter
      if (filters.wifiAvailability === 'yes' && !pg.wifiAvailability) return false;
      if (filters.wifiAvailability === 'no' && pg.wifiAvailability) return false;

      // Availability status
      if (filters.availabilityStatus !== 'all' && pg.availabilityStatus !== filters.availabilityStatus) {
        return false;
      }

      // Price filter
      if (pg.price > filters.maxPrice) return false;

      return true;
    });
  }, [pgs, filters]);

  return (
    <div className="min-h-screen bg-zinc-50 text-black flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white border border-black px-5 py-3 rounded-2xl card-shadow flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onOpenBookingsModal={() => setShowBookingsModal(true)}
        onOpenListingsModal={() => setShowListingsModal(true)}
        onOpenAddPGModal={() => {
          setEditingPG(null);
          setShowAddEditPGModal(true);
        }}
        onQuickLogin={handleQuickLogin}
        onLogout={handleLogout}
      />

      {/* Hero & Search Banner */}
      <HeroSearch
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onResetFilters={() =>
          setFilters({
            city: 'All',
            state: 'All',
            genderPreference: 'all',
            roomSharingType: 'all',
            foodAvailability: 'all',
            wifiAvailability: 'all',
            availabilityStatus: 'all',
            minPrice: 0,
            maxPrice: 20000,
            searchQuery: '',
          })
        }
        totalResults={filteredPGs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Section Title Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-black flex items-center gap-2">
              <Building2 className="w-6 h-6 text-black" />
              <span>Available Paying Guest Stays</span>
            </h2>
            <p className="text-xs text-zinc-500 italic mt-0.5">
              Browse verified PG accommodations across major tech cities
            </p>
          </div>

          {!currentUser && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" /> Sign in to Book or Host
            </button>
          )}
        </div>

        {/* PG Listings Grid */}
        {pgError && (
          <div className="bg-white border border-zinc-200 rounded-[32px] card-shadow p-5 flex items-start gap-3 text-xs">
            <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-black">{pgError}</p>
            </div>
          </div>
        )}

        {loadingPGs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-[32px] bg-zinc-200/60 animate-pulse border border-zinc-300" />
            ))}
          </div>
        ) : filteredPGs.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-[32px] card-shadow p-12 text-center space-y-3 max-w-lg mx-auto my-12">
            <SearchX className="w-12 h-12 text-zinc-400 mx-auto" />
            <h3 className="font-serif-display text-2xl font-bold text-black">No PGs match your filters</h3>
            <p className="text-xs text-zinc-500 italic">
              Try adjusting your city selection, price range, or gender preferences.
            </p>
            <button
              onClick={() =>
                setFilters({
                  city: 'All',
                  state: 'All',
                  genderPreference: 'all',
                  roomSharingType: 'all',
                  foodAvailability: 'all',
                  wifiAvailability: 'all',
                  availabilityStatus: 'all',
                  minPrice: 0,
                  maxPrice: 20000,
                  searchQuery: '',
                })
              }
              className="bg-black hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all card-shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPGs.map((pg) => (
              <PGCard
                key={pg._id}
                pg={pg}
                onSelect={(selected) => loadPGDetail(selected._id)}
                onBook={(selected) => {
                  if (!currentUser) {
                    setShowAuthModal(true);
                  } else if (currentUser.role !== 'Customer') {
                    showToast('Only Customer accounts can book a stay. Switching role...');
                    setShowAuthModal(true);
                  } else {
                    loadPGDetail(selected._id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* AI Personal Real Estate Agent Section */}
      <AIAgentSection
        onScheduleTour={() => showToast('Virtual tour request sent to AI Assistant!')}
      />

      {/* Expanding Across India Section */}
      <ExpandingAcrossIndia
        onSelectCity={(selectedCity) => {
          setFilters((prev) => ({ ...prev, city: selectedCity }));
          const el = document.getElementById('search-filter-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Upgrade Living Experience CTA Section */}
      <UpgradeCTA
        onGetStarted={() => {
          const el = document.getElementById('search-filter-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onScheduleDemo={() => {
          showToast('Demo request submitted! Our AI team will reach out shortly.');
        }}
      />

      {/* FAQ & AI Business Growth Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* MODALS */}

      {/* PG Detail Modal */}
      {selectedPG && (
        <PGDetailModal
          pg={selectedPG}
          reviews={selectedPGReviews}
          currentUser={currentUser}
          onClose={() => setSelectedPG(null)}
          onRefreshData={() => refreshPGs()}
          onReviewsChange={setSelectedPGReviews}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onBookSuccess={() => {
            setSelectedPG(null);
            setShowBookingsModal(true);
            showToast('Stay booking confirmed successfully!');
          }}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            refreshCurrentUser();
            refreshPGs();
            showToast('Welcome to Stayfinder!');
          }}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && currentUser && (
        <UserProfileModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onRefreshUser={refreshCurrentUser}
          onLogout={handleLogout}
        />
      )}

      {/* My Bookings Modal (Customers) */}
      {showBookingsModal && (
        <MyBookingsModal
          onClose={() => setShowBookingsModal(false)}
          onSelectPG={(pgId) => {
            setShowBookingsModal(false);
            loadPGDetail(pgId);
          }}
        />
      )}

      {/* My Listings Modal (PG Owners) */}
      {showListingsModal && (
        <MyListingsModal
          onClose={() => setShowListingsModal(false)}
          onOpenAddPG={() => {
            setShowListingsModal(false);
            setEditingPG(null);
            setShowAddEditPGModal(true);
          }}
          onEditPG={(pg) => {
            setShowListingsModal(false);
            setEditingPG(pg);
            setShowAddEditPGModal(true);
          }}
          onRefreshData={refreshPGs}
        />
      )}

      {/* Add / Edit PG Modal */}
      {showAddEditPGModal && (
        <AddEditPGModal
          existingPG={editingPG}
          onClose={() => {
            setShowAddEditPGModal(false);
            setEditingPG(null);
          }}
          onSuccess={() => {
            setShowAddEditPGModal(false);
            setEditingPG(null);
            refreshPGs();
            showToast(editingPG ? 'PG updated successfully!' : 'New PG property listed!');
          }}
        />
      )}

      {/* Live AI Assistant Demo Chat Widget */}
      <ChatWidget />
    </div>
  );
}
