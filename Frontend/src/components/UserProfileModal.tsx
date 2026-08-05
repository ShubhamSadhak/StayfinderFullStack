import React, { useState } from 'react';
import { X, User as UserIcon, Lock, MapPin, CheckCircle2, ShieldCheck, LogOut, AlertCircle, Save } from 'lucide-react';
import { User } from '../types';
import { api } from '../api';

interface UserProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onRefreshUser: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  onClose,
  onRefreshUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Account Update State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(
    typeof currentUser.location === 'object' ? currentUser.location.city || '' : ''
  );
  const [state, setState] = useState(
    typeof currentUser.location === 'object' ? currentUser.location.state || '' : ''
  );
  const [pincode, setPincode] = useState(
    typeof currentUser.location === 'object' ? currentUser.location.pincode || '' : ''
  );

  const [updateMsg, setUpdateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg(null);
    setLoading(true);

    const res = await api.updateAccount({
      name,
      email,
      phone,
      location: { city, state, pincode },
    });

    setLoading(false);

    if (res.success) {
      setUpdateMsg({ type: 'success', text: 'Account details updated successfully.' });
      onRefreshUser();
    } else {
      setUpdateMsg({ type: 'error', text: res.message || 'Failed to update account.' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg(null);
    setLoading(true);

    const res = await api.changePassword({ oldPassword, newPassword });
    setLoading(false);

    if (res.success) {
      setUpdateMsg({ type: 'success', text: 'Password changed successfully.' });
      setOldPassword('');
      setNewPassword('');
    } else {
      setUpdateMsg({ type: 'error', text: res.message || 'Password update failed.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-[32px] w-full max-w-lg card-shadow-lg overflow-hidden text-black flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white font-serif-display font-bold flex items-center justify-center text-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-black">{currentUser.name}</h2>
              <span className="text-xs text-black font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {currentUser.role === 'PG_Owner' ? 'PG Owner Account' : 'Customer Account'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex border-b border-zinc-200 text-xs font-bold uppercase tracking-wider gap-6">
          <button
            onClick={() => {
              setActiveTab('profile');
              setUpdateMsg(null);
            }}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'profile' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            Profile & Contact
          </button>
          <button
            onClick={() => {
              setActiveTab('password');
              setUpdateMsg(null);
            }}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'password' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          {updateMsg && (
            <div
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                updateMsg.type === 'success'
                  ? 'bg-black text-white border-black'
                  : 'bg-black text-white border-black'
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              <span>{updateMsg.text}</span>
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px] flex items-center justify-between">
                  <span>Phone Number</span>
                  <span className="text-black font-bold flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-black" /> Twilio Verified
                  </span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560001"
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-black hover:underline font-bold uppercase tracking-wider text-[10px]"
                >
                  <LogOut className="w-4 h-4" /> Logout Account
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all card-shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Update Account'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="password123"
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all card-shadow"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Updating Password...' : 'Change Password'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
