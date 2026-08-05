import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:8000/api/v1';
const TOKEN_STORAGE_KEY = 'stayfinder_token';
export const AUTH_EXPIRED_EVENT = 'stayfinder:auth-expired';

let authToken = localStorage.getItem(TOKEN_STORAGE_KEY);

export const getAuthToken = () => authToken;

export const setAuthToken = (token) => {
  authToken = token || null;

  if (authToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    return;
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';
    const responseMessage = error?.response?.data?.message || '';

    if (status === 401 && !requestUrl.includes('/users/login')) {
      setAuthToken(null);
      window.dispatchEvent(
        new CustomEvent(AUTH_EXPIRED_EVENT, {
          detail: {
            message: responseMessage || 'Your session has expired. Please log in again.',
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export const toApiSuccess = (response, transform) => {
  const payload = response?.data || {};
  const mappedData = typeof transform === 'function' ? transform(payload.data, payload) : payload.data;

  return {
    statusCode: payload.statusCode ?? response.status,
    success: payload.success ?? true,
    message: payload.message || 'Success',
    data: mappedData ?? null,
  };
};

export const toApiError = (error, fallbackMessage = 'Request failed') => {
  const payload = error?.response?.data;

  return {
    statusCode: payload?.statusCode ?? error?.response?.status ?? 500,
    success: false,
    message: payload?.message || error?.message || fallbackMessage,
    data: payload?.data ?? null,
  };
};
