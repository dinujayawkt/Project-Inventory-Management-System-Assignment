import api from './api';

const itemService = {
  getAll: async () => {
    const response = await api.get('/items');
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/items', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  incrementQuantity: async (id, amount) => {
    const response = await api.get(`/items/${id}`);
    const item = response.data;
    return itemService.update(id, {
      ...item,
      quantity: item.quantity + amount,
    });
  },

  decrementQuantity: async (id, amount) => {
    const response = await api.get(`/items/${id}`);
    const item = response.data;
    return itemService.update(id, {
      ...item,
      quantity: item.quantity - amount,
    });
  },
};

export default itemService;
