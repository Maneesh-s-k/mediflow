// src/components/patientQueue/NowServing.jsx
import React from 'react';
import Button from '../common/Button';

const NowServing = ({ currentPatients = [], onComplete, onCancel }) => {
  if (!currentPatients || currentPatients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <i className="fas fa-user-clock text-5xl mb-4"></i>
        <p className="text-lg">No patients currently being served</p>
        <p className="text-sm mt-2">Click "Call Next" to serve the next patient in queue</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currentPatients.map(patient => (
        <div key={patient._id} className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-green-800/50 backdrop-blur-sm rounded-lg p-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-3xl font-bold text-white">
              {patient.name.charAt(0)}
            </div>
            <div className="mt-2 text-center">
              <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300 border border-green-800">
                Currently Serving
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{patient.name}</h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm text-gray-400">Token</p>
                <p className="font-medium">{patient.token}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Age/Gender</p>
                <p className="font-medium">{patient.age}/{patient.gender.charAt(0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Department</p>
                <p className="font-medium">{patient.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Urgency Level</p>
                <p className="font-medium">
                  {patient.urgencyLevel === 4 ? 'Critical'
                    : patient.urgencyLevel === 3 ? 'High'
                    : patient.urgencyLevel === 2 ? 'Medium'
                    : 'Low'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Symptoms</p>
                <p className="font-medium">{patient.symptoms || 'None specified'}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                variant="success"
                icon="fas fa-check"
                onClick={() => onComplete(patient._id)}
              >
                Complete
              </Button>
              <Button
                variant="outline"
                icon="fas fa-undo"
                onClick={() => onCancel(patient._id)}
              >
                Return to Queue
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NowServing;
