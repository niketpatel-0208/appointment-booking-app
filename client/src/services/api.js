// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://appointment-booking-api-dolj.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
