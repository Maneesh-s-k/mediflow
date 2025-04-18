import React from 'react';
import Button from '../common/Button';

const StaffDetails = ({ staff, onClose, onEdit }) => {
  if (!staff) {
    return (
      <div className="text-center p-10">
        <i className="fas fa-user-md fa-3x text-gray-600 mb-3"></i>
        <p className="text-lg text-gray-400">Select a staff member to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">{staff.name}</h2>
          <p className="text-gray-400">{staff.id}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          staff.status === 'active' ? 'bg-green-600' : 
          staff.status === 'leave' ? 'bg-amber-500' : 'bg-gray-600'
        } text-white`}>
          {staff.status.toUpperCase()}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Professional Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Role:</span> {staff.role}</p>
            <p><span className="text-gray-400">Department:</span> {staff.department}</p>
            <p><span className="text-gray-400">Specialty:</span> {staff.specialty}</p>
            <p><span className="text-gray-400">Shift:</span> {staff.shift}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Email:</span> {staff.email}</p>
            <p><span className="text-gray-400">Phone:</span> {staff.contact}</p>
            <p><span className="text-gray-400">Join Date:</span> {new Date(staff.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={() => onEdit(staff)}>Edit</Button>
      </div>
    </div>
  );
};

export default StaffDetails;
