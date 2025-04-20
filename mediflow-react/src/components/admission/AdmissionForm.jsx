// components/admission/AdmissionForm.jsx
import React, { useState } from 'react';
import Button from '../common/Button';

export default function AdmissionForm({ patient, availableBeds, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    admissionType: 'Planned',
    admissionReason: '',
    assignedBed: '',
    attendingPhysician: '',
    estimatedStayDuration: 1,
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.admissionType) newErrors.admissionType = 'Required';
    if (!formData.admissionReason) newErrors.admissionReason = 'Required';
    if (!formData.assignedBed) newErrors.assignedBed = 'Please select a bed';
    if (!formData.attendingPhysician) newErrors.attendingPhysician = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!patient) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">New Admission</h2>
        <p className="text-center py-4">Please select a patient to admit</p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Admit Patient: {patient.name}</h2>
      
      <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Name:</span>
            <p>{patient.name}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Age/Gender:</span>
            <p>{patient.age} / {patient.gender}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Department:</span>
            <p>{patient.department}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Admission Type <span className="text-red-500">*</span>
            </label>
            <select
              name="admissionType"
              value={formData.admissionType}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.admissionType ? 'border-red-500' : 'border-gray-600'}`}
            >
              <option value="">Select Type</option>
              <option value="Emergency">Emergency</option>
              <option value="Planned">Planned</option>
              <option value="Transfer">Transfer</option>
            </select>
            {errors.admissionType && <p className="mt-1 text-sm text-red-500">{errors.admissionType}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Assigned Bed <span className="text-red-500">*</span>
            </label>
            <select
              name="assignedBed"
              value={formData.assignedBed}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.assignedBed ? 'border-red-500' : 'border-gray-600'}`}
            >
              <option value="">Select Bed</option>
              {availableBeds.map(bed => (
                <option key={bed._id} value={bed._id}>
                  {bed.location.ward} - Room {bed.location.room} - {bed.bedId}
                </option>
              ))}
            </select>
            {errors.assignedBed && <p className="mt-1 text-sm text-red-500">{errors.assignedBed}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Attending Physician <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="attendingPhysician"
              value={formData.attendingPhysician}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.attendingPhysician ? 'border-red-500' : 'border-gray-600'}`}
              placeholder="Enter physician name"
            />
            {errors.attendingPhysician && <p className="mt-1 text-sm text-red-500">{errors.attendingPhysician}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Estimated Stay (days)
            </label>
            <input
              type="number"
              name="estimatedStayDuration"
              value={formData.estimatedStayDuration}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Admission Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="admissionReason"
            value={formData.admissionReason}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.admissionReason ? 'border-red-500' : 'border-gray-600'}`}
            placeholder="Enter reason for admission"
          ></textarea>
          {errors.admissionReason && <p className="mt-1 text-sm text-red-500">{errors.admissionReason}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
            placeholder="Any additional notes"
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
          >
            Admit Patient
          </Button>
        </div>
      </form>
    </div>
  );
}
