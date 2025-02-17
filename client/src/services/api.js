import axios from 'axios';

export const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:8001') + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error);
    throw error;
  }
);
