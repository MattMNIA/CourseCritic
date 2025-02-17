import axios from 'axios';

// Clean up any quotes from the URL
const cleanUrl = (url) => url?.replace(/['"]/g, '') || 'http://localhost:8001';
const baseURL = cleanUrl(process.env.REACT_APP_API_URL);

console.log('Using API URL:', baseURL);

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
