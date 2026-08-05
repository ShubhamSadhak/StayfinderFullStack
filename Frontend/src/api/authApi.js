import { axiosInstance, setAuthToken, toApiError, toApiSuccess } from './api';
import { mapAuthPayload, mapUser } from './mappers';

export const login = async (payload) => {
  try {
    const response = await axiosInstance.post('/users/login', payload);

    return toApiSuccess(response, (data) => {
      if (data?.accessToken) {
        setAuthToken(data.accessToken);
      }

      return {
        user: mapUser(data?.user),
        accessToken: data?.accessToken || null,
        refreshToken: data?.refreshToken || null,
      };
    });
  } catch (error) {
    return toApiError(error, 'Login failed');
  }
};

export const register = async (payload) => {
  try {
    const response = await axiosInstance.post('/users/register', mapAuthPayload(payload));

    return toApiSuccess(response, (data) => ({
      user: mapUser(data),
    }));
  } catch (error) {
    return toApiError(error, 'Registration failed');
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/users/logout');
    setAuthToken(null);
    return toApiSuccess(response, () => null);
  } catch (error) {
    return toApiError(error, 'Logout failed');
  }
};
