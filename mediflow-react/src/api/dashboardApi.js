// src/api/dashboardApi.js
import api from './axiosConfig';

// Fetch dashboard statistics
export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data.data || {
      patientQueue: { count: 0, avgWaitTime: 0 },
      bedStatus: { available: 0, total: 0, occupancyRate: 0 },
      inventory: { lowStock: 0, critical: 0 },
      staffOnDuty: { total: 0, doctors: 0, nurses: 0 }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return default data structure to prevent UI errors
    return {
      patientQueue: { count: 0, avgWaitTime: 0 },
      bedStatus: { available: 0, total: 0, occupancyRate: 0 },
      inventory: { lowStock: 0, critical: 0 },
      staffOnDuty: { total: 0, doctors: 0, nurses: 0 }
    };
  }
};

// Fetch recent patient activity
export const fetchRecentActivity = async () => {
  try {
    const response = await api.get('/dashboard/recent-activity');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
};

// Fetch hospital metrics (for analytics)
export const fetchHospitalMetrics = async (timeframe = 'week') => {
  try {
    const response = await api.get(`/dashboard/metrics?timeframe=${timeframe}`);
    return response.data.data || {
      admissions: [],
      discharges: [],
      occupancyRate: [],
      averageStay: 0
    };
  } catch (error) {
    console.error('Error fetching hospital metrics:', error);
    return {
      admissions: [],
      discharges: [],
      occupancyRate: [],
      averageStay: 0
    };
  }
};
