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

// Patient Queue API
export const fetchPatientQueue = async () => {
  try {
    const response = await api.get('/patients/queue/status');
    return response.data.data.patients || [];
  } catch (error) {
    console.error('Error fetching patient queue:', error);
    throw error;
  }
};

export const addPatientToQueue = async (patientData) => {
  try {
    const response = await api.post('/patients/queue', patientData);
    return response.data;
  } catch (error) {
    console.error('Error adding patient to queue:', error);
    throw error;
  }
};

export const updatePatientStatus = async (patientId, status) => {
  try {
    const response = await api.patch(`/patients/${patientId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating patient status:', error);
    throw error;
  }
};

export const removePatientFromQueue = async (patientId) => {
  try {
    const response = await api.delete(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing patient from queue:', error);
    throw error;
  }
};

export default api;
