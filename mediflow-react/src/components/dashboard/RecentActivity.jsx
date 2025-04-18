import React, { useState } from 'react';

const RecentActivity = ({ activities = [] }) => {
  // If no activities are provided, use sample data
  const activityData = activities.length > 0 ? activities : [
    { 
      id: 1, 
      patient: { name: 'John Doe', initials: 'JD', color: 'bg-blue-500' }, 
      activity: 'Check-in', 
      department: 'Cardiology', 
      time: '10 min ago', 
      status: 'Completed' 
    },
    { 
      id: 2, 
      patient: { name: 'Alice Smith', initials: 'AS', color: 'bg-indigo-500' }, 
      activity: 'Vitals Captured', 
      department: 'General Medicine', 
      time: '15 min ago', 
      status: 'Completed' 
    },
    { 
      id: 3, 
      patient: { name: 'Robert Johnson', initials: 'RJ', color: 'bg-amber-500' }, 
      activity: 'Admission', 
      department: 'Orthopedics', 
      time: '25 min ago', 
      status: 'In Progress' 
    },
    { 
      id: 4, 
      patient: { name: 'Maria Parker', initials: 'MP', color: 'bg-red-500' }, 
      activity: 'Discharge', 
      department: 'Pediatrics', 
      time: '40 min ago', 
      status: 'Completed' 
    },
    { 
      id: 5, 
      patient: { name: 'Thomas Wilson', initials: 'TW', color: 'bg-emerald-500' }, 
      activity: 'Medication', 
      department: 'Neurology', 
      time: '55 min ago', 
      status: 'Pending' 
    }
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center">
          <i className="fas fa-history mr-2"></i> Recent Patient Activity
        </h3>
        <button className="bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3 rounded-lg transition-colors flex items-center">
          <i className="fas fa-sync-alt mr-1"></i> Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Activity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {activityData.map(activity => (
              <tr key={activity.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${activity.patient.color} flex items-center justify-center text-xs font-bold mr-3`}>
                      {activity.patient.initials}
                    </div>
                    <div className="text-sm font-medium">{activity.patient.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.activity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{activity.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={activity.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusClasses = {
    'Completed': 'bg-green-900/50 text-green-400 border border-green-800',
    'In Progress': 'bg-blue-900/50 text-blue-400 border border-blue-800',
    'Pending': 'bg-amber-900/50 text-amber-400 border border-amber-800',
    'Cancelled': 'bg-red-900/50 text-red-400 border border-red-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-900/50 text-gray-400 border border-gray-800'}`}>
      {status}
    </span>
  );
};

export default RecentActivity;
