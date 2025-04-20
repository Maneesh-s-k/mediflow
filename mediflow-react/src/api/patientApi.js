// src/api/patientApi.js
import api from './axiosConfig';

// Fetch patient queue
export const fetchPatientQueue = async () => {
    try {
      const response = await api.get('/patients/queue/status');
      
      // Safely extract patients array with proper fallbacks
      return response?.data?.data?.patients || [];
      
    } catch (error) {
      console.error('Error fetching patient queue:', error);
      throw error;
    }
  };

// Add patient to queue
export const addPatientToQueue = async (patientData) => {
  try {
    const response = await api.post('/patients/queue', patientData);
    return response.data;
  } catch (error) {
    console.error('Error adding patient to queue:', error);
    throw error;
  }
};

// Update patient status
export const updatePatientStatus = async (patientId, status) => {
  try {
    const response = await api.patch(`/patients/${patientId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating patient status:', error);
    throw error;
  }
};

// Remove patient from queue
export const removePatientFromQueue = async (patientId) => {
  try {
    const response = await api.delete(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing patient from queue:', error);
    throw error;
  }
};
