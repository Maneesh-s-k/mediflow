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
    <div className="bg-gray-800 rounded-lg p-4 shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Department Load</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map(dept => {
          const load = getLoadPercentage(dept.count, dept.capacity);
          return (
            <div key={dept.name} className="flex items-center bg-gray-900 rounded-lg p-3">
              <i className={`${dept.icon} text-2xl mr-3`} />
              <div className="flex-1">
                <div className="font-medium">{dept.name}</div>
                <div className="text-xs text-gray-400">
                  {dept.count} / {dept.capacity} patients
                </div>
                <div className="w-full bg-gray-700 rounded h-2 mt-1">
                  <div
                    className={`h-2 rounded ${getLoadColorClass(load)}`}
                    style={{ width: `${load}%` }}
                  />
                </div>
              </div>
              <div className="ml-3 text-sm font-semibold">{load}%</div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-sm text-gray-300">
        <strong>Total Capacity:</strong> {Object.values(departmentCapacity).reduce((sum, cap) => sum + cap, 0)}
        <span className="ml-4"><strong>Current Load:</strong> {patients.length} patients</span>
      </div>
    </div>
  );
};

export default DepartmentLoadList;
