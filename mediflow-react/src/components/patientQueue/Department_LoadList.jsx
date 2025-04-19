// src/components/patientQueue/Department_LoadList.jsx
import React from 'react';

const DepartmentLoadList = ({ patients = [] }) => {
  // Count patients by department
  const departmentCounts = patients.reduce((counts, patient) => {
    const dept = patient.department || 'Unassigned';
    counts[dept] = (counts[dept] || 0) + 1;
    return counts;
  }, {});

  // Department icons mapping
  const departmentIcons = {
    'General Medicine': 'fas fa-stethoscope text-blue-400',
    'Cardiology': 'fas fa-heartbeat text-red-400',
    'Orthopedics': 'fas fa-bone text-amber-400',
    'Pediatrics': 'fas fa-baby text-green-400',
    'Neurology': 'fas fa-brain text-purple-400',
    'Emergency': 'fas fa-ambulance text-red-400',
    'Unassigned': 'fas fa-question-circle text-gray-400'
  };

  // Department capacity (for load calculation)
  const departmentCapacity = {
    'General Medicine': 20,
    'Cardiology': 15,
    'Orthopedics': 10,
    'Pediatrics': 15,
    'Neurology': 10,
    'Emergency': 25,
    'Unassigned': 10
  };

  // Create array of departments with counts
  const departments = Object.keys(departmentIcons).map(dept => ({
    name: dept,
    count: departmentCounts[dept] || 0,
    capacity: departmentCapacity[dept] || 10,
    icon: departmentIcons[dept]
  }));

  // Calculate load percentage
  const getLoadPercentage = (count, capacity) => {
    return Math.min(Math.round((count / capacity) * 100), 100);
  };

  // Get load color class
  const getLoadColorClass = (percentage) => {
    if (percentage >= 75) return 'bg-red-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-4 space-y-4">
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
      
      {departments.map(dept => {
        const loadPercentage = getLoadPercentage(dept.count, dept.capacity);
        const colorClass = getLoadColorClass(loadPercentage);
        
        return (
          <div key={dept.name} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <i className={`${dept.icon} mr-2`}></i>
                <span className="font-medium">{dept.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">{dept.count}/{dept.capacity}</span>
                <span className="text-sm">{loadPercentage}%</span>
              </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colorClass}`}
                style={{ width: `${loadPercentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      
      <div className="mt-6 bg-gray-700/30 rounded-lg p-4">
        <h4 className="text-center text-sm font-medium mb-3">Department Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-400">Total Capacity</p>
            <p className="text-xl font-bold">
              {Object.values(departmentCapacity).reduce((sum, cap) => sum + cap, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Current Load</p>
            <p className="text-xl font-bold">
              {patients.length} patients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLoadList;
