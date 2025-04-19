// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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

// Auth API
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Dashboard API
export const fetchDashboardData = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data.data;
};

// Department API
export const fetchDepartmentLoad = async () => {
  const response = await api.get('/departments/load');
  return response.data.data;
};

// Patient API
export const fetchPatients = async () => {
  const response = await api.get('/patients');
  return response.data.data;
};

export const fetchPatientQueue = async () => {
  const response = await api.get('/patients/queue/status');
  return response.data.data;
};

export const addPatientToQueue = async (patientData) => {
  const response = await api.post('/patients/queue', patientData);
  return response.data;
};

export default api;
