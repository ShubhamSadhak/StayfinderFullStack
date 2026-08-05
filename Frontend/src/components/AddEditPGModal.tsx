import React, { useState } from 'react';
import { X, Building2, Plus, AlertCircle, Save } from 'lucide-react';
import { PGListing } from '../types';
import { api } from '../api';

interface AddEditPGModalProps {
  existingPG?: PGListing | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddEditPGModal: React.FC<AddEditPGModalProps> = ({
  existingPG,
  onClose,
  onSuccess,
}) => {
  const [pgName, setPgName] = useState(existingPG?.pgName || '');
  const [state, setState] = useState(existingPG?.location?.state || 'Karnataka');
  const [city, setCity] = useState(existingPG?.location?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(existingPG?.location?.pincode || '560038');
  const [address, setAddress] = useState(existingPG?.location?.address || '');

  const [price, setPrice] = useState(existingPG?.price ? String(existingPG.price) : '10000');
  const [foodAvailability, setFoodAvailability] = useState(existingPG?.foodAvailability ?? true);
  const [wifiAvailability, setWifiAvailability] = useState(existingPG?.wifiAvailability ?? true);
  const [genderPreference, setGenderPreference] = useState(existingPG?.genderPreference || 'Unisex');
  const [roomSharingType, setRoomSharingType] = useState(existingPG?.roomSharingType || 'Double');
  const [availabilityStatus, setAvailabilityStatus] = useState(existingPG?.availabilityStatus || 'Available');
  const [description, setDescription] = useState(existingPG?.description || '');
  const [amenitiesStr, setAmenitiesStr] = useState(
    existingPG?.amenities ? existingPG.amenities.join(', ') : '300Mbps Wi-Fi, Food Included, AC, Daily Housekeeping'
  );
  const [imageUrl, setImageUrl] = useState(
    existingPG?.images && existingPG.images.length > 0
      ? existingPG.images[0]
      : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pgName || !city || !price) {
      setError('PG Name, City, and Monthly Price are required.');
      return;
    }

    setLoading(true);

    const payload = {
      pgName,
      location: { state, city, pincode, address },
      price: Number(price),
      foodAvailability,
      wifiAvailability,
      genderPreference,
      roomSharingType,
      availabilityStatus,
      description,
      amenities: amenitiesStr.split(',').map((a) => a.trim()).filter(Boolean),
      images: [imageUrl.trim()].filter(Boolean),
    };

    let res;
    if (existingPG) {
      res = await api.updatePG(existingPG._id, payload);
    } else {
      res = await api.addPG(payload);
    }

    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.message || 'Failed to save PG listing.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-[32px] w-full max-w-2xl max-h-[92vh] flex flex-col card-shadow-lg overflow-hidden text-black">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="font-serif-display text-2xl font-bold text-black">{existingPG ? 'Edit PG Listing' : 'List New PG Property'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="bg-black text-white border border-black p-3 rounded-2xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              <span>{error}</span>
            </div>
          )}

          {/* PG Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">PG Property Name *</label>
              <input
                type="text"
                value={pgName}
                onChange={(e) => setPgName(e.target.value)}
                placeholder="e.g. Starlight Executive PG"
                required
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              />
            </div>

            <div>
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Monthly Rent (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="10000"
                required
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              />
            </div>
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                required
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              />
            </div>

            <div>
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">State *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Karnataka"
                required
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              />
            </div>

            <div>
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Pincode *</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="560038"
                required
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Address / Landmark</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 100ft Road, Near Metro Station, Indiranagar"
              className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
            />
          </div>

          {/* Preferences & Types */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Gender Preference</label>
              <select
                value={genderPreference}
                onChange={(e) => setGenderPreference(e.target.value as any)}
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Room Sharing Type</label>
              <select
                value={roomSharingType}
                onChange={(e) => setRoomSharingType(e.target.value as any)}
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              >
                <option value="Single">Single Sharing</option>
                <option value="Double">Double Sharing</option>
                <option value="Triple">Triple Sharing</option>
              </select>
            </div>

            <div>
              <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Availability Status</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>

          {/* Food & Wifi Checkboxes */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-100 p-3.5 rounded-2xl border border-zinc-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={foodAvailability}
                onChange={(e) => setFoodAvailability(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              <span className="font-bold text-black">Food Available (3x Meals)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wifiAvailability}
                onChange={(e) => setWifiAvailability(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              <span className="font-bold text-black">Wi-Fi Available</span>
            </label>
          </div>

          {/* Description & Amenities */}
          <div>
            <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide key details regarding living environment, nearby transit, etc."
              className="w-full bg-white border border-zinc-200 text-black p-3 rounded-xl focus:outline-none focus:border-black font-semibold"
            />
          </div>

          <div>
            <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Amenities (Comma separated)</label>
            <input
              type="text"
              value={amenitiesStr}
              onChange={(e) => setAmenitiesStr(e.target.value)}
              placeholder="Wi-Fi, Food Included, AC, Daily Housekeeping, Security"
              className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
            />
          </div>

          <div>
            <label className="block text-black mb-1 font-bold uppercase tracking-wider text-[10px]">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-white border border-zinc-200 text-black px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-black font-semibold"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-zinc-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-zinc-200 bg-white text-black font-bold hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 bg-black hover:bg-zinc-800 text-white font-bold px-5 py-2 rounded-full text-xs uppercase tracking-wider transition-all card-shadow"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : existingPG ? 'Update Listing' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
