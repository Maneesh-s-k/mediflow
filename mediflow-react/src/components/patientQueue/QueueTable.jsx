import React from 'react';

const QueueTable = ({ patients = [], stats = { total: 0, waiting: 0, avgWaitTime: 0 }, onCallPatient, onRemovePatient }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center">
          <i className="fas fa-list-ol mr-2"></i> Current Queue
        </h3>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs border border-gray-700">
            Total: <span id="totalPatients" className="font-medium">{stats.total}</span>
          </span>
          <span className="px-2 py-1 bg-amber-800/50 rounded-md text-xs border border-amber-700">
            Waiting: <span id="waitingPatients" className="font-medium">{stats.waiting}</span>
          </span>
          <span className="px-2 py-1 bg-blue-800/50 rounded-md text-xs border border-blue-700">
            Avg. Wait: <span id="avgWaitTime" className="font-medium">{stats.avgWaitTime}</span> min
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age/Gender</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Urgency</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Wait Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {patients.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                  No patients in queue
                </td>
              </tr>
            ) : (
              patients.map(patient => {
                // Calculate wait time so far
                const arrivalTime = new Date(patient.arrivalTime);
                const now = new Date();
                const waitedSoFar = Math.round((now - arrivalTime) / 60000); // in minutes
                
                // Set row color based on urgency
                const rowClass = patient.urgencyLevel === 4 
                  ? 'bg-red-900/20' 
                  : patient.urgencyLevel === 3 
                    ? 'bg-amber-900/20' 
                    : '';
                
                return (
                  <tr key={patient.id} className={`hover:bg-gray-700/30 transition-colors ${rowClass}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <strong>{patient.token}</strong>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.age}/{patient.gender.charAt(0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{patient.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UrgencyBadge level={patient.urgencyLevel} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{waitedSoFar} min / {patient.estimatedWaitTime} min</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => onCallPatient(patient.id)}
                        className="btn btn-sm btn-primary p-1 bg-blue-600 hover:bg-blue-500 rounded mr-2"
                        title="Call Patient"
                      >
                        <i className="fas fa-phone-alt"></i>
                      </button>
                      <button 
                        onClick={() => onRemovePatient(patient.id)}
                        className="btn btn-sm btn-danger p-1 bg-red-600 hover:bg-red-500 rounded"
                        title="Remove Patient"
                      >
                        <i className="fas fa-times"></i>
                      </button>
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

const UrgencyBadge = ({ level }) => {
  const badges = {
    1: { text: 'Low', class: 'bg-green-900/50 text-green-400 border border-green-800' },
    2: { text: 'Medium', class: 'bg-blue-900/50 text-blue-400 border border-blue-800' },
    3: { text: 'High', class: 'bg-amber-900/50 text-amber-400 border border-amber-800' },
    4: { text: 'Critical', class: 'bg-red-900/50 text-red-400 border border-red-800' }
  };

  const badge = badges[level] || badges[1];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.class}`}>
      {badge.text}
    </span>
  );
};

export default QueueTable;
