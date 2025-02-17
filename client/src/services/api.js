import axios from 'axios';

// Debug log to see the value
console.log('API URL:', import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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
