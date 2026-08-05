import { axiosInstance, toApiError, toApiSuccess } from './api';
import { mapProfilePayload, mapUser } from './mappers';

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/users/current-user');

    return toApiSuccess(response, (data) => ({
      user: mapUser(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to fetch current user');
  }
};

export const updateAccount = async (payload) => {
  try {
    const response = await axiosInstance.patch('/users/update-account', mapProfilePayload(payload));

    return toApiSuccess(response, (data) => ({
      user: mapUser(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to update account');
  }
};

export const changePassword = async (payload) => {
  try {
    const response = await axiosInstance.post('/users/change-password', payload);
    return toApiSuccess(response, () => null);
  } catch (error) {
    return toApiError(error, 'Failed to change password');
  }
};
