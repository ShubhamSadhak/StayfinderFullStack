import { AUTH_EXPIRED_EVENT, getAuthToken, setAuthToken } from './api';
import { login, logout, register } from './authApi';
import { sendOtp, verifyOtp } from './otpApi';
import { getCurrentUser, updateAccount, changePassword } from './userApi';
import { addPG, deletePG, getAllPGs, getPGById, updatePG } from './pgApi';
import { bookPG, cancelBooking, getBookings } from './bookingApi';
import { addReview, deleteReview, updateReview } from './reviewApi';

export { AUTH_EXPIRED_EVENT, getAuthToken, setAuthToken };

export const api = {
  login,
  logout,
  register,
  sendOtp,
  verifyOtp,
  getCurrentUser,
  updateAccount,
  changePassword,
  getAllPGs,
  getPGById,
  addPG,
  updatePG,
  deletePG,
  bookPG,
  getBookings,
  cancelBooking,
  addReview,
  updateReview,
  deleteReview,
};
