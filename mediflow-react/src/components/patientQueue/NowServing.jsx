// src/components/patientQueue/NowServing.jsx
import React from 'react';
import Button from '../common/Button';

const NowServing = ({ currentPatient, onCallNext, onComplete, onCancel }) => {
  // Calculate how long the patient has been served
  const calculateServiceTime = (startTime) => {
    if (!startTime) return '0 min';
    const start = new Date(startTime);
    const now = new Date();
    const diffInMinutes = Math.floor((now - start) / 60000);
    return `${diffInMinutes} min`;
  };

  if (!currentPatient) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <i className="fas fa-user-clock text-5xl mb-4"></i>
        <p className="text-lg">No patient currently being served</p>
        <p className="text-sm mt-2">Click "Call Next" to serve the next patient in queue</p>
        <Button variant="primary" onClick={onCallNext}>
          Call Next
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-green-800/50 backdrop-blur-sm rounded-lg p-4 mb-4">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-3xl font-bold text-white">
          {currentPatient.name.charAt(0)}
        </div>
        <div className="mt-2 text-center">
          <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300 border border-green-800">
            Currently Serving
          </span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold">{currentPatient.name}</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-sm text-gray-400">Token</p>
            <p className="font-medium">{currentPatient.token}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Age/Gender</p>
            <p className="font-medium">{currentPatient.age}/{currentPatient.gender.charAt(0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Department</p>
            <p className="font-medium">{currentPatient.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Urgency Level</p>
            <p className="font-medium">
              {currentPatient.urgencyLevel === 4 ? 'Critical'
                : currentPatient.urgencyLevel === 3 ? 'High'
                : currentPatient.urgencyLevel === 2 ? 'Medium'
                : 'Low'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Service Time</p>
            <p className="font-medium">
              {calculateServiceTime(currentPatient.serviceStartTime)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Symptoms</p>
            <p className="font-medium">{currentPatient.symptoms || 'None specified'}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button
            variant="success"
            icon="fas fa-check"
            onClick={onComplete}
          >
            Complete
          </Button>
          <Button
            variant="outline"
            icon="fas fa-undo"
            onClick={onCancel}
          >
            Return to Queue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NowServing;
