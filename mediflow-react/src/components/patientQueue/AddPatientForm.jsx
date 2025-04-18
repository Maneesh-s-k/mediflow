import React, { useState } from 'react';

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
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      1: 1.5,    // Low priority - longer wait
      2: 1.0,    // Medium priority - standard wait
      3: 0.6,    // High priority - shorter wait
      4: 0.3     // Critical - very short wait
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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3">
        <h3 className="font-semibold text-white flex items-center">
          <i className="fas fa-user-plus mr-2"></i> Add New Patient
        </h3>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">Patient Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="120"
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="department" className="block text-sm font-medium">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
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
          
          <div className="space-y-2">
            <label htmlFor="urgencyLevel" className="block text-sm font-medium">Urgency Level</label>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="1">Low (Routine)</option>
              <option value="2">Medium (Priority)</option>
              <option value="3">High (Urgent)</option>
              <option value="4">Critical (Emergency)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="symptoms" className="block text-sm font-medium">Chief Complaints</label>
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Vitals</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="bg-gray-700 px-3 py-2 rounded-l-md border border-gray-700">BP</span>
                <input
                  type="text"
                  id="bloodPressure"
                  name="vitals.bloodPressure"
                  value={formData.vitals.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                  className="flex-1 px-3 py-2 bg-gray-800 border-y border-r border-gray-700 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <span className="bg-gray-700 px-3 py-2 rounded-l-md border border-gray-700">Temp</span>
                <input
                  type="text"
                  id="temperature"
                  name="vitals.temperature"
                  value={formData.vitals.temperature}
                  onChange={handleChange}
                  placeholder="98.6"
                  className="flex-1 px-3 py-2 bg-gray-800 border-y border-gray-700"
                />
                <span className="bg-gray-700 px-3 py-2 rounded-r-md border border-gray-700">°F</span>
              </div>
              <div className="flex items-center">
                <span className="bg-gray-700 px-3 py-2 rounded-l-md border border-gray-700">HR</span>
                <input
                  type="text"
                  id="heartRate"
                  name="vitals.heartRate"
                  value={formData.vitals.heartRate}
                  onChange={handleChange}
                  placeholder="72"
                  className="flex-1 px-3 py-2 bg-gray-800 border-y border-gray-700"
                />
                <span className="bg-gray-700 px-3 py-2 rounded-r-md border border-gray-700">bpm</span>
              </div>
              <div className="flex items-center">
                <span className="bg-gray-700 px-3 py-2 rounded-l-md border border-gray-700">SpO₂</span>
                <input
                  type="text"
                  id="oxygenSaturation"
                  name="vitals.oxygenSaturation"
                  value={formData.vitals.oxygenSaturation}
                  onChange={handleChange}
                  placeholder="98"
                  className="flex-1 px-3 py-2 bg-gray-800 border-y border-r border-gray-700 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-2 px-4 rounded-md transition-all duration-300"
          >
            Add to Queue
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientForm;
