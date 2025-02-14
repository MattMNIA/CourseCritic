import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://157.230.188.42:8001/api',  // Updated to use VM's IP
  headers: {
    'Content-Type': 'application/json',
  },
});
