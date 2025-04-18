import React, { useState } from 'react';
import Button from '../common/Button';

const VitalsForm = ({ patientName, onSubmit }) => {
  const [vitals, setVitals] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    weight: '',
    height: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate BMI if weight and height are provided
    let bmi = null;
    if (vitals.weight && vitals.height) {
      const heightInMeters = parseFloat(vitals.height) / 100;
      bmi = (parseFloat(vitals.weight) / (heightInMeters * heightInMeters)).toFixed(1);
    }
    
    onSubmit({
      ...vitals,
      bmi
    });
  };

  return (
    <div className="p-6">
      <h4 className="text-lg font-medium mb-4 flex items-center">
        <i className="fas fa-stethoscope mr-2 text-blue-400"></i> Capture Vitals
      </h4>
      <div className="text-center mb-6">
        <i className="fas fa-heartbeat text-4xl text-red-500 mb-3 animate-pulse-slow"></i>
        <h5 className="text-xl font-medium">{patientName}</h5>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="bloodPressure" className="block text-sm font-medium">Blood Pressure (mmHg)</label>
          <div className="flex">
            <input
              type="text"
              id="bloodPressureSystolic"
              name="bloodPressureSystolic"
              placeholder="120"
              value={vitals.bloodPressureSystolic}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 bg-gray-800 rounded-l-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <span className="flex items-center justify-center px-2 bg-gray-700 border-y border-gray-700">/</span>
            <input
              type="text"
              id="bloodPressureDiastolic"
              name="bloodPressureDiastolic"
              placeholder="80"
              value={vitals.bloodPressureDiastolic}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 bg-gray-800 rounded-r-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="heartRate" className="block text-sm font-medium">Heart Rate (bpm)</label>
          <input
            type="number"
            id="heartRate"
            name="heartRate"
            min="30"
            max="250"
            value={vitals.heartRate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="temperature" className="block text-sm font-medium">Temperature (°F)</label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            step="0.1"
            min="90"
            max="110"
            value={vitals.temperature}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="oxygenSaturation" className="block text-sm font-medium">Oxygen Saturation (%)</label>
          <input
            type="number"
            id="oxygenSaturation"
            name="oxygenSaturation"
            min="50"
            max="100"
            value={vitals.oxygenSaturation}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="respiratoryRate" className="block text-sm font-medium">Respiratory Rate (breaths/min)</label>
          <input
            type="number"
            id="respiratoryRate"
            name="respiratoryRate"
            min="5"
            max="60"
            value={vitals.respiratoryRate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="weight" className="block text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.1"
              min="0"
              max="300"
              value={vitals.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="height" className="block text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              min="0"
              max="300"
              value={vitals.height}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <Button 
          type="submit" 
          variant="success" 
          className="w-full"
          icon="fas fa-check-circle"
        >
          Submit Vitals
        </Button>
      </form>
    </div>
  );
};

export default VitalsForm;
