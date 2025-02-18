import { api } from './api';

const reviewService = {
  submitReview: async (reviewData) => {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit review');
    }

    return await response.json();
  }
};

export default reviewService;
