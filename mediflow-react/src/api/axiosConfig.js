// src/api/axiosConfig.js
import axios from 'axios';

// Change this to match your backend port if not 5000
const API_URL = 'http://localhost:5050/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // If you want to send cookies or auth headers, enable this:
  // withCredentials: true,
});

// Add request interceptor to include auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add a response interceptor for debugging CORS/errors
api.interceptors.response.use(
  response => response,
  error => {
    // Log CORS or network errors for easier debugging
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Axios error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
