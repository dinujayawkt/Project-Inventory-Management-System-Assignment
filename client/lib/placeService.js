import api from './api';

const placeService = {
  getAll: async () => {
    const response = await api.get('/places');
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/places/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/places', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/places/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/places/${id}`);
    return response.data;
  },
};

export default placeService;
