import React from 'react';

const statusColors = {
  active: 'bg-green-600',
  leave: 'bg-amber-500',
  inactive: 'bg-gray-600'
};

const roleColors = {
  Doctor: 'bg-blue-600',
  Nurse: 'bg-teal-600',
  Technician: 'bg-purple-600',
  Admin: 'bg-indigo-600'
};

const StaffTable = ({ staff, onView, onEdit }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-700/50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Department</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Shift</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {staff.length === 0 ? (
          <tr>
            <td colSpan="7" className="px-4 py-3 text-center text-gray-400">No staff members found.</td>
          </tr>
        ) : (
          staff.map(member => (
            <tr key={member.id} className="hover:bg-gray-700/30 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">{member.id}</td>
              <td className="px-4 py-3 whitespace-nowrap font-medium">{member.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[member.role] || 'bg-gray-600'} text-white`}>
                  {member.role}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{member.department}</td>
              <td className="px-4 py-3 whitespace-nowrap">{member.shift}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[member.status] || 'bg-gray-600'} text-white`}>
                  {member.status.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  onClick={() => onView(member)}
                  className="btn btn-sm btn-primary p-1 bg-blue-600 hover:bg-blue-500 rounded mr-2"
                  title="View Details"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  onClick={() => onEdit(member)}
                  className="btn btn-sm btn-warning p-1 bg-amber-600 hover:bg-amber-500 rounded"
                  title="Edit"
                >
                  <i className="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default StaffTable;
