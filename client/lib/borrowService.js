import api from './api';

const borrowService = {
  borrowItem: async (borrowData) => {
    const response = await api.post('/borrow', borrowData);
    return response.data;
  },

  returnItem: async (id) => {
    const response = await api.post(`/return/${id}`, {});
    return response.data;
  },

  getBorrowedItems: async () => {
    const response = await api.get('/borrow');
    return response.data;
  },

  getReturnedItems: async () => {
    const response = await api.get('/return');
    return response.data;
  },
};

export default borrowService;
