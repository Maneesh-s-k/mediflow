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

  // Create array of departments with counts
  const departments = Object.keys(departmentIcons).map(dept => ({
    name: dept,
    count: departmentCounts[dept] || 0,
    icon: departmentIcons[dept]
  }));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-4 py-3">
        <h3 className="font-semibold text-white flex items-center">
          <i className="fas fa-hospital-alt mr-2"></i> Department Load
        </h3>
      </div>
      <div className="p-0">
        <ul id="departmentLoad" className="divide-y divide-gray-700">
          {departments.map(dept => (
            <li key={dept.name} className="flex justify-between items-center px-4 py-3 hover:bg-gray-700/30 transition-colors">
              <span className="flex items-center">
                <i className={dept.icon + " mr-2"}></i> {dept.name}
              </span>
              <span className="px-2 py-1 bg-blue-900/50 rounded-full text-xs border border-blue-700">
                {dept.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentLoadList;
