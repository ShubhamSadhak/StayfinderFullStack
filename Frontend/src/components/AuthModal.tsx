import React, { useState } from 'react';
import { X, User as UserIcon, Lock, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { api, setAuthToken } from '../api';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [role, setRole] = useState<UserRole>('Customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 9876543210');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560001');

  // OTP Verification flow
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter a phone number first.');
      return;
    }
    setError(null);
    setOtpLoading(true);
    const res = await api.sendOtp(phone);
    setOtpLoading(false);

    if (res.success) {
      setOtpSent(true);
    } else {
      setError(res.message || 'Failed to send OTP.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCodeInput) return;
    setError(null);
    setOtpLoading(true);
    const res = await api.verifyOtp(phone, otpCodeInput);
    setOtpLoading(false);

    if (res.success && res.data?.isVerified) {
      setIsPhoneVerified(true);
      setError(null);
    } else {
      setError(res.message || 'Invalid OTP code.');
    }
  };

  // Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await api.login({ email: loginEmail, password: loginPassword });
    setLoading(false);

    if (res.success && res.data?.accessToken) {
      setAuthToken(res.data.accessToken);
      onSuccess();
    } else {
      setError(res.message || 'Invalid credentials.');
    }
  };

  // Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPhoneVerified) {
      setError('Registration is blocked until your phone number is verified via Twilio OTP.');
      return;
    }

    setLoading(true);

    const res = await api.register({
      name,
      email,
      phone,
      password,
      role,
      location: { city, state, pincode },
    });

    if (!res.success) {
      setLoading(false);
      setError(res.message || 'Registration failed.');
      return;
    }

    const loginRes = await api.login({ email, password });
    setLoading(false);

    if (loginRes.success && loginRes.data?.accessToken) {
      setAuthToken(loginRes.data.accessToken);
      onSuccess();
    } else {
      setError(loginRes.message || 'Account created, but automatic sign in failed. Please sign in manually.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-[32px] w-full max-w-md card-shadow-lg overflow-hidden text-black flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <h2 className="font-serif-display text-2xl font-bold text-black">{mode === 'login' ? 'Sign In to Stayfinder' : 'Create Account'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="bg-black text-white border border-black p-3 rounded-2xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 bg-zinc-100 p-1 rounded-full border border-zinc-200 font-bold uppercase tracking-wider text-center text-[10px]">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-full transition-all ${
                mode === 'login' ? 'bg-black text-white card-shadow' : 'text-zinc-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 rounded-full transition-all ${
                mode === 'register' ? 'bg-black text-white card-shadow' : 'text-zinc-600 hover:text-black'
              }`}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    required
                    className="w-full bg-white border border-zinc-200 text-black pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white border border-zinc-200 text-black pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-full text-xs uppercase tracking-widest transition-all card-shadow mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* REGISTER FORM WITH PHONE VERIFICATION */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Account Role Selector */}
              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Select Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Customer')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'Customer'
                        ? 'bg-black border-black text-white font-bold'
                        : 'bg-white border-zinc-200 text-black'
                    }`}
                  >
                    Customer (Tenant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('PG_Owner')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      role === 'PG_Owner'
                        ? 'bg-black border-black text-white font-bold'
                        : 'bg-white border-zinc-200 text-black'
                    }`}
                  >
                    PG Owner (Host)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
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
                  placeholder="rahul@example.com"
                  required
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              {/* Twilio Phone OTP Verification Box */}
              <div className="bg-zinc-100 p-3.5 rounded-2xl border border-zinc-200 space-y-2">
                <label className="block text-black font-bold flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[10px] text-zinc-500">Phone OTP (Twilio Verify)</span>
                  {isPhoneVerified && (
                    <span className="text-black font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-black" /> Verified
                    </span>
                  )}
                </label>

                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isPhoneVerified}
                    placeholder="+91 9876543210"
                    required
                    className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                  {!isPhoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="bg-black text-white font-bold px-3.5 py-2 rounded-full text-[10px] uppercase tracking-wider shrink-0 hover:bg-zinc-800"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  )}
                </div>

                {otpSent && !isPhoneVerified && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-500 italic">
                      Enter the OTP sent to your phone number. The backend does not expose the OTP code in the API response.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otpCodeInput}
                        onChange={(e) => setOtpCodeInput(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2 rounded-xl focus:outline-none focus:border-black font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpLoading}
                        className="bg-black text-white font-bold px-3.5 py-2 rounded-full text-[10px] uppercase tracking-wider shrink-0 hover:bg-zinc-800"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    required
                    className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                    required
                    className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Karnataka"
                  required
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isPhoneVerified}
                className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-full text-xs uppercase tracking-widest transition-all card-shadow mt-2 disabled:opacity-50"
              >
                {loading ? 'Registering Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
