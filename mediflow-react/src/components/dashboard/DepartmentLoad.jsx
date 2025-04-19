// src/components/dashboard/DepartmentLoad.jsx
import React, { useState, useEffect } from 'react';
import { fetchDepartmentLoad } from '../../services/api';

const DepartmentLoad = () => {
  const [timeframe, setTimeframe] = useState('Today');
  const [departmentData, setDepartmentData] = useState([]);
  const [summary, setSummary] = useState({
    busiestDepartment: { name: '', load: 0 },
    availableCapacity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadDepartmentData = async () => {
      try {
        setLoading(true);
        const data = await fetchDepartmentLoad();
        setDepartmentData(data.departments);
        setSummary(data.summary);
        setLoading(false);
      } catch (err) {
        setError('Failed to load department data');
        setLoading(false);
        console.error(err);
      }
    };
    
    loadDepartmentData();
  }, [timeframe]);
  
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700 h-full p-4">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700 h-full p-4">
        <div className="text-red-500 text-center">
          <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700 h-full">
      <div className="bg-indigo-800/50 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-white">Department Load</h3>
        <div className="flex space-x-1">
          {['Today', 'Week', 'Month'].map(option => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`px-3 py-1 text-xs rounded ${
                timeframe === option 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Normal (0-50%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span className="text-xs">Medium (51-75%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">High (76-100%)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {departmentData.slice(0, 3).map(dept => {
            const loadPercentage = Math.round((dept.currentPatients / dept.capacity) * 100);
            
            return (
              <div key={dept.name} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-sm">{loadPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      loadPercentage <= 50 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      loadPercentage <= 75 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${loadPercentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex text-xs text-gray-400">
                  <span>Patients: {dept.currentPatients} | Wait: {dept.waitTime} min | Staff: {dept.staffCount}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-center text-sm font-medium mb-2">Department Summary</h4>
          <div className="text-center mb-2">
            <h5 className="text-sm font-medium">Busiest Department</h5>
            <p className="text-lg font-bold">{summary.busiestDepartment.name}</p>
            <p className="text-sm">({summary.busiestDepartment.load}%)</p>
          </div>
          <div className="text-center">
            <h5 className="text-sm font-medium">Available Capacity</h5>
            <p className="text-lg font-bold">{summary.availableCapacity} patients</p>
            <p className="text-sm">across all departments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLoad;
