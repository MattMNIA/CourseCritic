import { api } from './api';

const professorService = {
  getAllProfessors: async () => {
    try {
      const response = await api.get('/professors');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch professors:', error);
      throw error;
    }
  },
  getProfessorsByUniversity: async (universityId) => {
    try {
      const response = await api.get(`/professors/university/${universityId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch university professors:', error);
      throw error;
    }
  },
  createProfessor: async (name, universityId) => {
    try {
      const response = await api.post('/professors', { name, universityId });
      return response.data;
    } catch (error) {
      console.error('Failed to create professor:', error);
      throw error;
    }
  }
};

export default professorService;
