import { axiosInstance, toApiError, toApiSuccess } from './api';
import { mapBooking, mapBookingPayload } from './mappers';

export const bookPG = async (payload) => {
  try {
    const response = await axiosInstance.post('/booking/bookpg', mapBookingPayload(payload));

    return toApiSuccess(response, (data) => ({
      booking: mapBooking(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to book PG');
  }
};

export const getBookings = async () => {
  try {
    const response = await axiosInstance.get('/booking/getbookings');

    return toApiSuccess(response, (data) => ({
      bookings: Array.isArray(data) ? data.map(mapBooking) : [],
    }));
  } catch (error) {
    return toApiError(error, 'Failed to fetch bookings');
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.patch(`/booking/cancelbooking/${bookingId}`);

    return toApiSuccess(response, (data) => ({
      booking: mapBooking(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to cancel booking');
  }
};
