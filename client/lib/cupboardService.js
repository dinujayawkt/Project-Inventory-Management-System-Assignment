import api from './api';

const cupboardService = {
  getAll: async () => {
    const response = await api.get('/cupboards');
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/cupboards/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/cupboards', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/cupboards/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cupboards/${id}`);
    return response.data;
  },
};

export default cupboardService;
