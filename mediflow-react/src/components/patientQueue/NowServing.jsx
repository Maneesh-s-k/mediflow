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

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 overflow-hidden">
      <div className="bg-green-800/50 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center">
          <i className="fas fa-user-md mr-2"></i> Now Serving
        </h3>
        <Button 
          variant="primary" 
          size="sm" 
          icon="fas fa-user-plus" 
          onClick={onCallNext}
          disabled={currentPatient !== null}
        >
          Call Next
        </Button>
      </div>
      
      <div className="p-4">
        {!currentPatient ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <i className="fas fa-user-clock text-5xl mb-4"></i>
            <p className="text-lg">No patient currently being served</p>
            <p className="text-sm mt-2">Click "Call Next" to serve the next patient in queue</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentPatient.urgencyLevel === 4 ? 'bg-red-900/50 text-red-300 border border-red-800' :
                      currentPatient.urgencyLevel === 3 ? 'bg-amber-900/50 text-amber-300 border border-amber-800' :
                      currentPatient.urgencyLevel === 2 ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                      'bg-green-900/50 text-green-300 border border-green-800'
                    }`}>
                      {currentPatient.urgencyLevel === 4 ? 'Critical' :
                       currentPatient.urgencyLevel === 3 ? 'High' :
                       currentPatient.urgencyLevel === 2 ? 'Medium' : 'Low'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Service Time</p>
                  <p className="font-medium">{calculateServiceTime(currentPatient.serviceStartTime || new Date())}</p>
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
        )}
      </div>
    </div>
  );
};

export default NowServing;
