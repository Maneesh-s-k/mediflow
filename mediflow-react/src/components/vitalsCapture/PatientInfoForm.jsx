import React, { useState } from 'react';
import Button from '../common/Button';

const PatientInfoForm = ({ onContinue }) => {
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    chiefComplaint: '',
    department: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(patientInfo);
  };

  return (
    <div className="p-6">
      <h4 className="text-lg font-medium mb-4 flex items-center">
        <i className="fas fa-user-edit mr-2 text-blue-400"></i> Patient Information
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={patientInfo.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              min="0"
              max="120"
              value={patientInfo.age}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
            <select
              id="gender"
              name="gender"
              value={patientInfo.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="chiefComplaint" className="block text-sm font-medium">Chief Complaint</label>
          <textarea
            id="chiefComplaint"
            name="chiefComplaint"
            rows="2"
            value={patientInfo.chiefComplaint}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="space-y-2">
          <label htmlFor="department" className="block text-sm font-medium">Department</label>
          <select
            id="department"
            name="department"
            value={patientInfo.department}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Department</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          icon="fas fa-arrow-right"
        >
          Continue to Vitals
        </Button>
      </form>
    </div>
  );
};

export default PatientInfoForm;
