import React from 'react';
import Button from '../common/Button';

const RecentActivity = ({ activities = [], loading = false, error = null }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-blue-800/50 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-white">Recent Patient Activity</h3>
        <Button variant="outline" size="sm">Refresh</Button>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-400 text-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-gray-400 text-center">
            <p>No recent activities</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {activities.map(activity => (
                <tr key={activity.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${activity.patient.color || 'bg-blue-500'} flex items-center justify-center text-xs font-medium text-white`}>
                        {activity.patient.initials}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{activity.patient.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{activity.activity}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{activity.department}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{activity.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'Completed' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                      activity.status === 'In Progress' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                      'bg-amber-900/50 text-amber-300 border border-amber-800'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
