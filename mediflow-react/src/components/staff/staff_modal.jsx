import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

const StaffModal = ({ open, onClose, onSave, staff }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    role: '',
    department: '',
    specialty: '',
    status: 'active',
    contact: '',
    email: '',
    shift: '',
    joinDate: ''
  });

  useEffect(() => {
    if (staff) {
      setForm(staff);
    } else {
      setForm({
        id: '',
        name: '',
        role: '',
        department: '',
        specialty: '',
        status: 'active',
        contact: '',
        email: '',
        shift: '',
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [staff]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">{staff ? 'Edit' : 'Add'} Staff Member</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">ID</label>
              <input type="text" name="id" value={form.id} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required>
                <option value="">Select Role</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Technician">Technician</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Department</label>
              <select name="department" value={form.department} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required>
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Emergency">Emergency</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Specialty</label>
            <input type="text" name="specialty" value={form.specialty} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required>
                <option value="active">Active</option>
                <option value="leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Shift</label>
              <select name="shift" value={form.shift} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required>
                <option value="">Select Shift</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
                <option value="Rotating">Rotating</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact</label>
              <input type="tel" name="contact" value={form.contact} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Join Date</label>
            <input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700" required />
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary">{staff ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
