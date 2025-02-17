import axios from 'axios';

// Debug log to verify environment variable
console.log('Environment check:', {
  raw: process.env.REACT_APP_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
  VITE_API_URL: process.env.VITE_API_URL
});

// Remove string interpolation and /api suffix since it's causing issues
const baseUrl = '/api'
const cleanUrl = (url) => url.replace(/['"]/g, '');

console.log('Using API URL:', baseURL);
console.log('Using Clean API URL:', cleanUrl(baseURL));


export const api = axios.create({
  baseURL: baseUrl,
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
