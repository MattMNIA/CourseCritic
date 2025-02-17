import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
console.log('Using API URL:', apiUrl);

export const api = axios.create({
  baseURL: `${apiUrl}/api`,
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
