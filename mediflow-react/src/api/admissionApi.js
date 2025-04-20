// src/api/admissionApi.js
import api from './axiosConfig';

// Fetch all patients (for admission form dropdown)
export const fetchPatients = async () => {
  try {
    const response = await api.get('/patients');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};

// Fetch all admissions
export const fetchAdmissions = async () => {
  try {
    const response = await api.get('/admissions');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching admissions:', error);
    return [];
  }
};

// Fetch active admissions
export const fetchActiveAdmissions = async () => {
  try {
    const response = await api.get('/admissions/active');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching active admissions:', error);
    return [];
  }
};

// Fetch admission by ID
export const fetchAdmissionById = async (admissionId) => {
  try {
    const response = await api.get(`/admissions/${admissionId}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error fetching admission with ID ${admissionId}:`, error);
    return null;
  }
};

// Admit patient
export const admitPatient = async (admissionData) => {
  try {
    const response = await api.post('/admissions', admissionData);
    return response?.data?.data || null;
  } catch (error) {
    console.error('Error admitting patient:', error);
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Failed to admit patient: ${errorMessage}`);
  }
};

// Discharge patient
export const dischargePatient = async (admissionId, dischargeData = {}) => {
  try {
    const response = await api.patch(`/admissions/${admissionId}/discharge`, dischargeData);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error discharging patient with admission ID ${admissionId}:`, error);
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Failed to discharge patient: ${errorMessage}`);
  }
};

// Update admission
export const updateAdmission = async (admissionId, updateData) => {
  try {
    const response = await api.patch(`/admissions/${admissionId}`, updateData);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error updating admission with ID ${admissionId}:`, error);
    const errorMessage = error.response?.data?.error || error.message;
    throw new Error(`Failed to update admission: ${errorMessage}`);
  }
};

// Get admission statistics
export const fetchAdmissionStats = async (timeframe = 'week') => {
  try {
    const response = await api.get(`/admissions/stats?timeframe=${timeframe}`);
    return response?.data?.data || {
      total: 0,
      active: 0,
      discharged: 0,
      averageStayDuration: 0
    };
  } catch (error) {
    console.error('Error fetching admission statistics:', error);
    return {
      total: 0,
      active: 0,
      discharged: 0,
      averageStayDuration: 0
    };
  }
};
