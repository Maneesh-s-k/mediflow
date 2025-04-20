// src/components/admission/PatientSelectionTable.jsx
import React from 'react';
import Button from '../common/Button';

export default function PatientSelectionTable({ patients, onSelect }) {
  if (!patients || patients.length === 0) {
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
        <p>No patients available for admission</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age/Gender</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {patients.map(patient => (
            <tr key={patient._id} className="hover:bg-gray-700/30 transition-colors">
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
                <span className={`px-2 py-1 text-xs rounded-full ${
                  patient.status === 'Waiting' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800' :
                  patient.status === 'InService' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                  patient.status === 'Completed' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                  'bg-red-900/50 text-red-300 border border-red-800'
                }`}>
                  {patient.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => onSelect(patient)}
                >
                  Admit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
