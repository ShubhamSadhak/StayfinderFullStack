import { axiosInstance, toApiError, toApiSuccess } from './api';
import { mapCreateReviewPayload, mapReview, mapUpdateReviewPayload } from './mappers';

export const addReview = async (payload) => {
  try {
    const response = await axiosInstance.post('/users/review', mapCreateReviewPayload(payload));

    return toApiSuccess(response, (data) => ({
      review: mapReview(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to add review');
  }
};

export const updateReview = async (payload) => {
  try {
    const response = await axiosInstance.put('/users/updatereview', mapUpdateReviewPayload(payload));

    return toApiSuccess(response, (data) => ({
      review: mapReview(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to update review');
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete('/users/deletereview', {
      data: { reviewId },
    });

    return toApiSuccess(response, () => null);
  } catch (error) {
    return toApiError(error, 'Failed to delete review');
  }
};
