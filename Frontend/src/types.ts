export type UserRole = 'Customer' | 'PG_Owner';

export interface LocationData {
  state: string;
  city: string;
  pincode: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location?: LocationData | string;
  isPhoneVerified: boolean;
  createdAt?: string;
}

export type GenderPreference = 'Male' | 'Female' | 'Unisex';
export type RoomSharingType = 'Single' | 'Double' | 'Triple';
export type AvailabilityStatus = 'Available' | 'Not Available';

export interface PGListing {
  _id: string;
  pgName: string;
  owner: string | User;
  ownerName?: string;
  ownerPhone?: string;
  location: LocationData;
  price: number;
  foodAvailability: boolean;
  wifiAvailability: boolean;
  genderPreference: GenderPreference;
  roomSharingType: RoomSharingType;
  availabilityStatus: AvailabilityStatus;
  description?: string;
  amenities?: string[];
  images?: string[];
  ratingAverage?: number;
  totalReviews?: number;
  createdAt?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface Booking {
  _id: string;
  pg: string | PGListing;
  pgDetails?: PGListing;
  customer: string | User;
  customerName?: string;
  customerPhone?: string;
  fromDate: string;
  toDate: string;
  roomType: RoomSharingType;
  foodPreference: boolean;
  bookingStatus: BookingStatus;
  totalAmount?: number;
  createdAt?: string;
}

export interface Review {
  _id: string;
  pg: string;
  customer: string | User;
  customerName?: string;
  rating: number;
  feedback: string;
  createdAt?: string;
}

export interface VerifiedPhone {
  phone: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface FilterState {
  city: string;
  state: string;
  genderPreference: string;
  roomSharingType: string;
  foodAvailability: string; // 'all' | 'yes' | 'no'
  wifiAvailability: string; // 'all' | 'yes' | 'no'
  availabilityStatus: string; // 'all' | 'Available' | 'Not Available'
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
}
