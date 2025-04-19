// src/components/patientQueue/QueueTable.jsx
import React from 'react';
import Button from '../common/Button';

const QueueTable = ({ patients = [], stats = { total: 0, waiting: 0, avgWaitTime: 0 }, onCallPatient, onRemovePatient }) => {
  // Calculate how long the patient has been waiting
  const calculateWaitTime = (arrivalTime) => {
    if (!arrivalTime) return '0 min';
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now - arrival) / 60000);
    return `${diffInMinutes} min`;
  };

  // Get urgency level text
  const getUrgencyText = (level) => {
    switch(level) {
      case 4: return 'Critical';
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: 
      default: return 'Low';
    }
  };

  // Get urgency level class
  const getUrgencyClass = (level) => {
    switch(level) {
      case 4: return 'bg-red-900/50 text-red-300 border border-red-800';
      case 3: return 'bg-amber-900/50 text-amber-300 border border-amber-800';
      case 2: return 'bg-blue-900/50 text-blue-300 border border-blue-800';
      case 1: 
      default: return 'bg-green-900/50 text-green-300 border border-green-800';
    }
  };

  return (
    <div>
      <div className="px-4 py-3 bg-gray-700/30 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <div>
            <span className="text-sm text-gray-400">Total</span>
            <p className="font-semibold">{stats.total}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Waiting</span>
            <p className="font-semibold">{stats.waiting}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Avg. Wait</span>
            <p className="font-semibold">{stats.avgWaitTime} min</p>
          </div>
        </div>
        <div className="flex items-center">
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-sm"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age/Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Urgency</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Wait Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {patients.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  No patients in queue
                </td>
              </tr>
            ) : (
              patients.map(patient => {
                const waitedSoFar = calculateWaitTime(patient.arrivalTime);
                
                return (
                  <tr key={patient.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-medium">{patient.token}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">
                          {patient.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{patient.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {patient.age}/{patient.gender.charAt(0)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {patient.department}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyClass(patient.urgencyLevel)}`}>
                        {getUrgencyText(patient.urgencyLevel)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {waitedSoFar} / {patient.estimatedWaitTime} min
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button 
                          variant="primary" 
                          size="xs" 
                          icon="fas fa-user-check" 
                          onClick={() => onCallPatient(patient.id)}
                        >
                          Call
                        </Button>
                        <Button 
                          variant="danger" 
                          size="xs" 
                          icon="fas fa-user-times" 
                          onClick={() => onRemovePatient(patient.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueueTable;
