import { api } from './api';

const universityService = {
  getAllUniversities: async () => {
    try {
      const response = await api.get('/universities');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch universities');
    }
  }
};

export default universityService;
