import api from './api';

const activityLogService = {
  getAll: async () => {
    const response = await api.get('/activity-logs');
    return response.data;
  },
};

export default activityLogService;
