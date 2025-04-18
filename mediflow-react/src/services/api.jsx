// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      patientQueue: { count: 0, avgWaitTime: 0 },
      bedStatus: { available: 0, occupancyRate: 0 },
      inventory: { lowStock: 0, critical: 0 }
    };
  }
};

export const fetchPatientQueue = async () => {
  try {
    const response = await api.get('/patient-queue/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching patient queue:', error);
    return [];
  }
};



// Add more API functions for beds, admissions, etc.


export const addPatientToQueue = async (patientData) => {
  try {
    const response = await api.post('/patient-queue/add', {
      ...patientData,
      id: Date.now(), // Use timestamp as ID
      arrivalTime: new Date(),
    });
    return response.data;
  } catch (error) {
    console.error('Error adding patient to queue:', error);
    throw error;
  }
};

export default api;


