// src/components/dashboard/DepartmentLoad.jsx

import React, { useState, useEffect } from 'react';
import { fetchDepartmentLoad } from '../../api/departmentApi';

const DepartmentLoad = () => {
  const [timeframe, setTimeframe] = useState('Today');
  const [departmentData, setDepartmentData] = useState([]);
  const [summary, setSummary] = useState({ busiestDepartment: { name: '', load: 0 }, availableCapacity: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDepartmentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDepartmentLoad(timeframe);
        setDepartmentData(Array.isArray(data?.departments) ? data.departments : []);
        setSummary(data?.summary || { busiestDepartment: { name: '', load: 0 }, availableCapacity: 0 });
        setLoading(false);
      } catch (err) {
        setError('Failed to load department data');
        setLoading(false);
        console.error(err);
      }
    };
    loadDepartmentData();
  }, [timeframe]);

  const getLoadColorClass = (percentage) => {
    if (percentage >= 75) return 'bg-red-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };

  if (loading) return <div>Loading department data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Department Load ({timeframe})</h2>
        <select
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          className="bg-gray-700 text-white rounded px-2 py-1"
        >
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
      </div>
      {(departmentData || []).length === 0 ? (
        <div className="text-gray-400">No department data available.</div>
      ) : (
        (departmentData || []).slice(0, 3).map((dept, idx) => (
          <div key={dept.name || idx} className="flex items-center mb-2">
            <span className="w-32">{dept.name}</span>
            <span className={`ml-2 px-2 py-1 rounded ${getLoadColorClass(dept.load)}`}>
              {dept.load}%
            </span>
          </div>
        ))
      )}
      <div className="mt-2 text-sm text-gray-300">
        <strong>Busiest Department:</strong> {summary.busiestDepartment?.name || 'N/A'} ({summary.busiestDepartment?.load ?? 0}%)
      </div>
      <div className="text-sm text-gray-300">
        <strong>Available Capacity:</strong> {summary.availableCapacity ?? 0} patients across all departments
      </div>
    </div>
  );
};

export default DepartmentLoad;
