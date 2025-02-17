require('dotenv').config();

export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8001'
};
