// src/api/bedApi.js
import api from './axiosConfig';

// Fetch all beds
export const fetchBeds = async () => {
  try {
    const response = await api.get('/beds');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching beds:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Fetch available beds
export const fetchAvailableBeds = async () => {
  try {
    const response = await api.get('/beds/available');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching available beds:', error);
    // Return empty array instead of throwing
    return [];
  }
};

// Fetch bed by ID
export const fetchBedById = async (bedId) => {
  try {
    const response = await api.get(`/beds/${bedId}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error fetching bed with ID ${bedId}:`, error);
    return null;
  }
};

// Update bed status
export const updateBedStatus = async (bedId, status) => {
  try {
    const response = await api.patch(`/beds/${bedId}/status`, { status });
    return response?.data?.data || null;
  } catch (error) {
    console.error(`Error updating bed status for bed ${bedId}:`, error);
    throw new Error(`Failed to update bed status: ${error.response?.data?.error || error.message}`);
  }
};

// Get bed occupancy statistics
export const fetchBedStats = async () => {
  try {
    const response = await api.get('/beds/stats');
    return response?.data?.data || {
      total: 0,
      available: 0,
      occupied: 0,
      maintenance: 0,
      occupancyRate: 0
    };
  } catch (error) {
    console.error('Error fetching bed statistics:', error);
    return {
      total: 0,
      available: 0,
      occupied: 0,
      maintenance: 0,
      occupancyRate: 0
    };
  }
};
