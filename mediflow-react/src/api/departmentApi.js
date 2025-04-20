// src/api/departmentApi.js
import api from './axiosConfig';

// Fetch all departments
export const fetchDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Fetch department by ID
export const fetchDepartmentById = async (departmentId) => {
  try {
    const response = await api.get(`/departments/${departmentId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching department ${departmentId}:`, error);
    throw error;
  }
};

// Fetch department load data
export const fetchDepartmentLoad = async () => {
  try {
    const response = await api.get('/departments/load');
    return response.data.data || { 
      departments: [], 
      summary: { 
        busiestDepartment: { name: '', load: 0 }, 
        availableCapacity: 0,
        staffDistribution: { doctors: 0, nurses: 0 }
      } 
    };
  } catch (error) {
    console.error('Error fetching department load:', error);
    // Return a default structure to prevent UI errors
    return { 
      departments: [], 
      summary: { 
        busiestDepartment: { name: '', load: 0 }, 
        availableCapacity: 0,
        staffDistribution: { doctors: 0, nurses: 0 }
      } 
    };
  }
};

// Create a new department
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post('/departments', departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update a department
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    const response = await api.put(`/departments/${departmentId}`, departmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating department ${departmentId}:`, error);
    throw error;
  }
};

// Delete a department
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await api.delete(`/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department ${departmentId}:`, error);
    throw error;
  }
};
