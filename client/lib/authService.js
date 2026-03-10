import api from './api';

const authService = {
  login: async (email, password) => {
      const response = await api.post('/login', { email, password });

      const data = response.data;

      // store authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    },

  createUser: async (userData) => {
    const response = await api.post('/create-user', userData);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
