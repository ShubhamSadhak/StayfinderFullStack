import { axiosInstance, toApiError, toApiSuccess } from './api';
import { normalizePhoneNumber } from './mappers';

export const sendOtp = async (phone) => {
  try {
    const response = await axiosInstance.post('/otp/send-otp', {
      phoneNo: Number(normalizePhoneNumber(phone)),
    });

    return toApiSuccess(response, () => ({
      phone,
      otpCode: null,
      note: response.data?.message || 'OTP sent successfully',
    }));
  } catch (error) {
    return toApiError(error, 'Failed to send OTP');
  }
};

export const verifyOtp = async (phone, otp) => {
  try {
    const response = await axiosInstance.post('/otp/verify-otp', {
      phoneNo: Number(normalizePhoneNumber(phone)),
      otp,
    });

    return toApiSuccess(response, () => ({
      phone,
      isVerified: true,
    }));
  } catch (error) {
    return toApiError(error, 'Failed to verify OTP');
  }
};
