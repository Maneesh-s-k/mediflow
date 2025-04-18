import React, { useState } from 'react';
import Button from '../common/Button';

const AdmissionForm = ({ onAdmit }) => {
  const [form, setForm] = useState({
    patientName: '',
    age: '',
    gender: '',
    contactNumber: '',
    emergencyContact: '',
    admissionType: '',
    department: '',
    diagnosis: '',
    attendingDoctor: '',
    wardType: '',
    insuranceInfo: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdmit(form);
    setForm({
      patientName: '',
      age: '',
      gender: '',
      contactNumber: '',
      emergencyContact: '',
      admissionType: '',
      department: '',
      diagnosis: '',
      attendingDoctor: '',
      wardType: '',
      insuranceInfo: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Patient Name</label>
        <input type="text" name="patientName" value={form.patientName} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Age</label>
          <input type="number" name="age" value={form.age} onChange={handleChange}
            min="0" max="120"
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Contact Number</label>
        <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Emergency Contact</label>
        <input type="tel" name="emergencyContact" value={form.emergencyContact} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Admission Type</label>
        <select name="admissionType" value={form.admissionType} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
          <option value="">Select Type</option>
          <option>Emergency</option>
          <option>Planned</option>
          <option>Transfer</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Department</label>
        <select name="department" value={form.department} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
          <option value="">Select Department</option>
          <option>General Medicine</option>
          <option>Cardiology</option>
          <option>Orthopedics</option>
          <option>Pediatrics</option>
          <option>Neurology</option>
          <option>Obstetrics</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Provisional Diagnosis</label>
        <input type="text" name="diagnosis" value={form.diagnosis} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Attending Doctor</label>
        <input type="text" name="attendingDoctor" value={form.attendingDoctor} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Ward Type</label>
        <select name="wardType" value={form.wardType} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
          <option value="">Select Ward</option>
          <option>General</option>
          <option>ICU</option>
          <option>Pediatric</option>
          <option>Maternity</option>
          <option>Isolation</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Insurance Information</label>
        <input type="text" name="insuranceInfo" value={form.insuranceInfo} onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <Button type="submit" variant="primary" className="w-full" icon="fas fa-hospital-user">
        Admit Patient
      </Button>
    </form>
  );
};

export default AdmissionForm;
