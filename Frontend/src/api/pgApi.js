import { axiosInstance, toApiError, toApiSuccess } from './api';
import { mapPG, mapPGPayload } from './mappers';

export const getAllPGs = async () => {
  try {
    const response = await axiosInstance.get('/pg/getpg');

    return toApiSuccess(response, (data) => ({
      pgs: Array.isArray(data) ? data.map(mapPG) : [],
    }));
  } catch (error) {
    return toApiError(error, 'Failed to fetch PG listings');
  }
};

export const getPGById = async (pgId) => {
  try {
    const response = await axiosInstance.get(`/pg/getpg/${pgId}`);

    return toApiSuccess(response, (data) => ({
      pg: mapPG(data),
      reviews: [],
    }));
  } catch (error) {
    return toApiError(error, 'Failed to fetch PG details');
  }
};

export const addPG = async (payload) => {
  try {
    const response = await axiosInstance.post('/pg/addpg', mapPGPayload(payload));

    return toApiSuccess(response, (data) => ({
      pg: mapPG(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to create PG listing');
  }
};

export const updatePG = async (pgId, payload) => {
  try {
    const response = await axiosInstance.put(`/pg/updatepg/${pgId}`, mapPGPayload(payload));

    return toApiSuccess(response, (data) => ({
      pg: mapPG(data),
    }));
  } catch (error) {
    return toApiError(error, 'Failed to update PG listing');
  }
};

export const deletePG = async (pgId) => {
  try {
    const response = await axiosInstance.delete(`/pg/deletepg/${pgId}`);
    return toApiSuccess(response, () => null);
  } catch (error) {
    return toApiError(error, 'Failed to delete PG listing');
  }
};
