import React from 'react';

const AdmissionsTable = ({ admissions, onView }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700/50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age/Gender</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Diagnosis</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bed</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Admitted On</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {admissions.length === 0 ? (
          <tr>
            <td colSpan="8" className="px-4 py-3 text-center text-gray-400">No admissions yet.</td>
          </tr>
        ) : (
          admissions.map(adm => (
            <tr key={adm.id} className="hover:bg-gray-700/30 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm">{adm.id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{adm.patientName}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{adm.age}/{adm.gender?.charAt(0)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{adm.department}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{adm.diagnosis}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{adm.bedId || '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">{adm.admissionDate ? new Date(adm.admissionDate).toLocaleDateString() : '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <button
                  onClick={() => onView(adm)}
                  className="btn btn-sm btn-primary p-1 bg-blue-600 hover:bg-blue-500 rounded"
                  title="View Admission"
                >
                  <i className="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AdmissionsTable;
