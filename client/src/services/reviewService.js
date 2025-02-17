import { api } from './api';

const reviewService = {
  submitReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  }
};

export default reviewService;
