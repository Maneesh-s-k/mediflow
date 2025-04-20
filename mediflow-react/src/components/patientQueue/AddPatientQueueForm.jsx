import React, { useState } from 'react';
import Button from '../common/Button';

const AddPatientQueueForm = ({ onAddPatient, onCancel }) => {
  const [departments] = useState([
    'Cardiology', 'General Medicine', 'Pediatrics',
    'Orthopedics', 'Neurology', 'Emergency'
  ]);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', contact: '',
    department: '', urgencyLevel: '1', symptoms: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (isNaN(formData.age) || parseInt(formData.age) <= 0) newErrors.age = 'Age must be a positive number';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.contact) newErrors.contact = 'Contact is required';
    if (!formData.department) newErrors.department = 'Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const token = `Q${Math.floor(1000 + Math.random() * 9000)}`;
      const estimatedWaitTime = calculateEstimatedWaitTime(formData.department, parseInt(formData.urgencyLevel));
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        urgencyLevel: parseInt(formData.urgencyLevel),
        token,
        estimatedWaitTime,
        status: 'Waiting',
        arrivalTime: new Date()
      };
      await onAddPatient(patientData);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error adding patient to queue:', error);
      setIsSubmitting(false);
    }
  };

  const calculateEstimatedWaitTime = (department, urgencyLevel) => {
    const departmentWaitTimes = {
      'General Medicine': 30, 'Cardiology': 45, 'Orthopedics': 40,
      'Pediatrics': 25, 'Neurology': 50, 'Emergency': 15
    };
    const urgencyMultipliers = { 1: 1.5, 2: 1.0, 3: 0.6, 4: 0.3 };
    let waitTime = departmentWaitTimes[department] || 30;
    waitTime *= urgencyMultipliers[urgencyLevel] || 1.0;
    waitTime += Math.floor(Math.random() * 10) - 5;
    return Math.max(5, Math.round(waitTime));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Patient Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Enter patient name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.age ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Enter age"
            min="1"
          />
          {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.gender ? 'border-red-500' : 'border-gray-600'}`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.contact ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Enter contact number"
          />
          {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.department ? 'border-red-500' : 'border-gray-600'}`}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Urgency Level <span className="text-red-500">*</span>
          </label>
          <select
            name="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Critical</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Symptoms
        </label>
        <textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
          placeholder="Enter symptoms"
          rows="3"
        ></textarea>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          icon="fas fa-plus" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add to Queue'}
        </Button>
      </div>
    </form>
  );
};

export default AddPatientQueueForm;
