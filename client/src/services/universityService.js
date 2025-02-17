import { api } from './api';

const universityService = {
  getAllUniversities: async () => {
    try {
      console.log('ENV varible:', process.env.REACT_APP_API_URL)
      console.log('API Base URL:', api.defaults.baseURL);
      const response = await api.get('/universities');
      
      // Add validation
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
      
    } catch (error) {
      console.error('Universities service error:', error);
      console.error('Response:', error.response);
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
