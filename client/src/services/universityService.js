import { api } from './api';

const universityService = {
  getAllUniversities: async () => {
    try {
      const response = await api.get('/universities');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch universities:', error);
      throw error;
    }
  },
  
  getUniversityStats: async (id) => {
    try {
      const response = await api.get(`/universities/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch university stats:', error);
      throw error;
    }
  }
};

export default universityService;
