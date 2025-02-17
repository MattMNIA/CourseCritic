import axios from 'axios';

// Remove string interpolation and /api suffix since it's causing issues
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';
const cleanUrl = (url) => url.replace(/['"]/g, '');

console.log('Using API URL:', baseURL);
console.log('Using Clean API URL:', cleanUrl(baseURL));


export const api = axios.create({
  baseURL: baseURL,
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
