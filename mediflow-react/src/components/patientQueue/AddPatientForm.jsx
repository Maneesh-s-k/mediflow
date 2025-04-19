// src/components/patientQueue/AddPatientForm.jsx
import React, { useState } from 'react';
import Button from '../common/Button';

const AddPatientForm = ({ onAddPatient }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    department: '',
    urgencyLevel: '1',
    symptoms: '',
    vitals: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      oxygenSaturation: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    else if (isNaN(formData.age) || parseInt(formData.age) <= 0) newErrors.age = 'Age must be a positive number';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.department) newErrors.department = 'Department is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new patient object
      const newPatient = {
        id: Date.now(), // Use timestamp as ID
        token: `A${Math.floor(1000 + Math.random() * 9000)}`, // Generate random token
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        department: formData.department,
        urgencyLevel: parseInt(formData.urgencyLevel),
        symptoms: formData.symptoms,
        vitals: {
          bloodPressure: formData.vitals.bloodPressure,
          temperature: formData.vitals.temperature,
          heartRate: formData.vitals.heartRate,
          oxygenSaturation: formData.vitals.oxygenSaturation
        },
        arrivalTime: new Date(),
        estimatedWaitTime: calculateEstimatedWaitTime(formData.department, parseInt(formData.urgencyLevel))
      };
      
      const success = await onAddPatient(newPatient);
      
      if (success) {
        // Reset form
        setFormData({
          name: '',
          age: '',
          gender: '',
          department: '',
          urgencyLevel: '1',
          symptoms: '',
          vitals: {
            bloodPressure: '',
            temperature: '',
            heartRate: '',
            oxygenSaturation: ''
          }
        });
        alert(`Patient ${newPatient.name} added to queue with token ${newPatient.token}`);
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient to queue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to calculate estimated wait time
  const calculateEstimatedWaitTime = (department, urgencyLevel) => {
    // Base wait times by department (in minutes)
    const departmentWaitTimes = {
      'General Medicine': 30,
      'Cardiology': 45,
      'Orthopedics': 40,
      'Pediatrics': 25,
      'Neurology': 50,
      'Emergency': 15
    };
    
    // Adjust by urgency level
    const urgencyMultipliers = {
      1: 1.5, // Low priority - longer wait
      2: 1.0, // Medium priority - standard wait
      3: 0.6, // High priority - shorter wait
      4: 0.3  // Critical - very short wait
    };
    
    // Calculate base wait time
    let waitTime = departmentWaitTimes[department] || 30;
    
    // Apply urgency multiplier
    waitTime *= urgencyMultipliers[urgencyLevel] || 1.0;
    
    // Add some randomness
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
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.age ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.gender ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
            Department <span className="text-red-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 rounded-md border ${errors.department ? 'border-red-500' : 'border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Select Department</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
            <option value="Emergency">Emergency</option>
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
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Critical</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Symptoms
          </label>
          <input
            type="text"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter symptoms"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Vitals (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Blood Pressure
            </label>
            <input
              type="text"
              name="vitals.bloodPressure"
              value={formData.vitals.bloodPressure}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 120/80"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Temperature
            </label>
            <input
              type="text"
              name="vitals.temperature"
              value={formData.vitals.temperature}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 98.6°F"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Heart Rate
            </label>
            <input
              type="text"
              name="vitals.heartRate"
              value={formData.vitals.heartRate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 75 bpm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Oxygen Saturation
            </label>
            <input
              type="text"
              name="vitals.oxygenSaturation"
              value={formData.vitals.oxygenSaturation}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 98%"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setFormData({
            name: '',
            age: '',
            gender: '',
            department: '',
            urgencyLevel: '1',
            symptoms: '',
            vitals: {
              bloodPressure: '',
              temperature: '',
              heartRate: '',
              oxygenSaturation: ''
            }
          })}
        >
          Reset
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

export default AddPatientForm;
