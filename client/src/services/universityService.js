import { api } from './api';

const universityService = {
  getAllUniversities: async () => {
    const response = await api.get('/universities');
    return response.data;
  }
};

export default universityService;
