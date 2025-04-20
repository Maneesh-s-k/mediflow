// src/components/admission/AdmissionForm.jsx
import React, { useState, useEffect } from 'react';
import { fetchPatients } from '../../api/admissionApi'; // Updated import path
import Button from '../common/Button';

const AdmissionForm = ({ onSubmit, onCancel, availableBeds }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: '',
    admissionType: 'Planned',
    admissionReason: '',
    assignedBedId: '',
    attendingPhysician: '',
    diagnosisCodes: '',
    notes: '',
    estimatedStayDuration: 1,
    insuranceProvider: '',
    policyNumber: ''
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading patients:', error);
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert diagnosisCodes string to array
    const formattedData = {
      ...formData,
      diagnosisCodes: formData.diagnosisCodes.split(',').map(code => code.trim()),
      insuranceDetails: {
        provider: formData.insuranceProvider,
        policyNumber: formData.policyNumber
      }
    };
    
    delete formattedData.insuranceProvider;
    delete formattedData.policyNumber;
    
    onSubmit(formattedData);
  };

  if (loading) {
    return <div>Loading patient data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Admit New Patient</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Patient <span className="text-red-500">*</span>
          </label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {patient.name} ({patient.patientId || patient._id})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Admission Type <span className="text-red-500">*</span>
          </label>
          <select
            name="admissionType"
            value={formData.admissionType}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
            required
          >
            <option value="Emergency">Emergency</option>
            <option value="Planned">Planned</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Bed Assignment <span className="text-red-500">*</span>
          </label>
          <select
            name="assignedBedId"
            value={formData.assignedBedId}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
            required
          >
            <option value="">Select Bed</option>
            {availableBeds.map(bed => (
              <option key={bed._id} value={bed._id}>
                {bed.bedId} - {bed.location.ward}, {bed.location.room}
              </option>
            ))}
          </select>
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
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
            required
          />
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
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Diagnosis Codes (comma separated)
          </label>
          <input
            type="text"
            name="diagnosisCodes"
            value={formData.diagnosisCodes}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
            placeholder="e.g. A00.1, B20.3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Insurance Provider
          </label>
          <input
            type="text"
            name="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Policy Number
          </label>
          <input
            type="text"
            name="policyNumber"
            value={formData.policyNumber}
            onChange={handleChange}
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
          className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
          required
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600"
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
  );
};

export default AdmissionForm;
