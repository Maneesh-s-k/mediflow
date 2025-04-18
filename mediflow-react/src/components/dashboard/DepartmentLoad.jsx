import React, { useState } from 'react';

const DepartmentLoad = ({ departments = [] }) => {
  const [timeFilter, setTimeFilter] = useState('today');
  
  // If no departments are provided, use sample data
  const departmentData = departments.length > 0 ? departments : [
    { name: 'Cardiology', load: 75, icon: 'fas fa-heartbeat', color: 'text-red-400', patients: 15, capacity: 20, waitTime: 45, staff: 5 },
    { name: 'General Medicine', load: 60, icon: 'fas fa-stethoscope', color: 'text-blue-400', patients: 12, capacity: 20, waitTime: 30, staff: 4 },
    { name: 'Pediatrics', load: 45, icon: 'fas fa-baby', color: 'text-green-400', patients: 9, capacity: 20, waitTime: 20, staff: 3 },
    { name: 'Orthopedics', load: 30, icon: 'fas fa-bone', color: 'text-amber-400', patients: 6, capacity: 20, waitTime: 15, staff: 2 },
    { name: 'Neurology', load: 50, icon: 'fas fa-brain', color: 'text-purple-400', patients: 10, capacity: 20, waitTime: 25, staff: 3 },
    { name: 'Emergency', load: 85, icon: 'fas fa-ambulance', color: 'text-red-400', patients: 17, capacity: 20, waitTime: 60, staff: 6 }
  ];
  
  // Find the busiest department
  const busiestDept = [...departmentData].sort((a, b) => b.load - a.load)[0];

  // Calculate total available capacity
  const totalCapacity = departmentData.reduce((sum, dept) => sum + (dept.capacity - dept.patients), 0);

  // Calculate total staff
  const totalStaff = departmentData.reduce((sum, dept) => sum + dept.staff, 0);
  const doctors = Math.round(totalStaff * 0.4); // Assuming 40% of staff are doctors
  const nurses = totalStaff - doctors;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center">
          <i className="fas fa-hospital-alt mr-2"></i> Department Load
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            className={`text-xs px-2 py-1 rounded border border-gray-600 transition-colors ${timeFilter === 'today' ? 'bg-white/20' : 'bg-gray-700/50 hover:bg-gray-700'}`}
            onClick={() => setTimeFilter('today')}
          >
            Today
          </button>
          <button 
            className={`text-xs px-2 py-1 rounded border border-gray-600 transition-colors ${timeFilter === 'week' ? 'bg-white/20' : 'bg-gray-700/50 hover:bg-gray-700'}`}
            onClick={() => setTimeFilter('week')}
          >
            Week
          </button>
          <button 
            className={`text-xs px-2 py-1 rounded border border-gray-600 transition-colors ${timeFilter === 'month' ? 'bg-white/20' : 'bg-gray-700/50 hover:bg-gray-700'}`}
            onClick={() => setTimeFilter('month')}
          >
            Month
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-end space-x-3 mb-2 text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span>Normal (0-50%)</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
            <span>Medium (51-75%)</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            <span>High (76-100%)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {departmentData.slice(0, 3).map(dept => (
              <DepartmentCard key={dept.name} department={dept} />
            ))}
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 text-blue-400">Department Summary</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Busiest Department</p>
                  <p className="font-medium flex items-center">
                    <i className={`${busiestDept.icon} mr-2 ${busiestDept.color}`}></i> {busiestDept.name} ({busiestDept.load}%)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Available Capacity</p>
                  <p className="font-medium">{totalCapacity} patients across all departments</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Staff Distribution</p>
                  <p className="font-medium">{doctors} doctors, {nurses} nurses on duty</p>
                </div>
                <div className="pt-2">
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded transition-colors">
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2 text-blue-400">Other Departments</h4>
              <div className="space-y-3">
                {departmentData.slice(3).map(dept => (
                  <div key={dept.name} className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                      <i className={`${dept.icon} mr-2 ${dept.color}`}></i> {dept.name}
                    </span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                        <div 
                          className={`${
                            dept.load > 75 ? 'bg-red-500' : dept.load > 50 ? 'bg-amber-500' : 'bg-green-500'
                          } h-2 rounded-full`} 
                          style={{width: `${dept.load}%`}}
                        ></div>
                      </div>
                      <span className="text-xs">{dept.load}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DepartmentCard = ({ department }) => {
  const getStatusInfo = (load) => {
    if (load > 75) return { text: 'High', class: 'bg-red-900/50 border-red-700' };
    if (load > 50) return { text: 'Medium', class: 'bg-amber-900/50 border-amber-700' };
    return { text: 'Normal', class: 'bg-green-900/50 border-green-700' };
  };
  
  const getBarColor = (load) => {
    if (load > 75) return 'from-yellow-500 to-red-600';
    if (load > 50) return 'from-green-500 to-amber-500';
    return 'from-green-600 to-green-400';
  };

  const status = getStatusInfo(department.load);

  return (
    <div className="department-bar bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium flex items-center">
          <i className={`${department.icon} mr-2 ${department.color}`}></i> {department.name}
        </span>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">{department.load}%</span>
          <span className={`px-2 py-1 text-xs rounded-full ${status.class}`}>{status.text}</span>
        </div>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden relative">
        <div 
          className={`bg-gradient-to-r ${getBarColor(department.load)} h-3 rounded-full animate-load`} 
          style={{width: `${department.load}%`}}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>Patients: {department.patients}/{department.capacity}</span>
        <span>Wait: ~{department.waitTime} min</span>
        <span>Staff: {department.staff}</span>
      </div>
    </div>
  );
};

export default DepartmentLoad;
