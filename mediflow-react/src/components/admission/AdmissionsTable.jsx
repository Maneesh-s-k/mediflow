import React from 'react';
import Button from '../common/Button';

const AdmissionsTable = ({ admissions, onView, onDischarge }) => {
  if (admissions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <i className="fas fa-bed text-5xl mb-4"></i>
        <p className="text-lg">No active admissions found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Current Admissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Admission ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bed</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Admission Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {admissions.map(admission => (
              <tr key={admission._id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono">{admission.admissionId}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {admission.patientName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {admission.assignedBed?.bedId || 'Not assigned'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(admission.admissionDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    admission.status === 'Active' ? 'bg-green-900/50 text-green-300 border border-green-800' :
                    admission.status === 'Discharged' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                    'bg-gray-900/50 text-gray-300 border border-gray-800'
                  }`}>
                    {admission.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="xs"
                      icon="fas fa-eye"
                      onClick={() => onView(admission)}
                    >
                      View
                    </Button>
                    {admission.status === 'Active' && (
                      <Button
                        variant="danger"
                        size="xs"
                        icon="fas fa-sign-out-alt"
                        onClick={() => onDischarge(admission._id)}
                      >
                        Discharge
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdmissionsTable;
