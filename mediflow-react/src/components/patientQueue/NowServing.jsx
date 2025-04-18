import React from 'react';

const NowServing = ({ currentPatient, onCallNext, onComplete, onCancel }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3">
        <h3 className="font-semibold text-white flex items-center">
          <i className="fas fa-user-clock mr-2"></i> Now Serving
        </h3>
      </div>
      <div className="p-4 text-center">
        {!currentPatient ? (
          <div id="noPatientServing">
            <i className="fas fa-user-clock fa-3x text-gray-500 mb-3"></i>
            <p className="text-lg text-gray-300">No patient currently being served</p>
            <button 
              onClick={onCallNext}
              className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-2 px-4 rounded-md transition-all duration-300"
            >
              <i className="fas fa-phone-alt mr-2"></i> Call Next Patient
            </button>
          </div>
        ) : (
          <div id="currentPatientServing">
            <div className="mb-3">
              <span className="px-3 py-1 bg-blue-900/50 rounded-md text-sm border border-blue-700">
                Token {currentPatient.token}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{currentPatient.name}</h3>
            <p className="text-gray-300 mb-2">
              {currentPatient.age}/{currentPatient.gender.charAt(0)} - {currentPatient.department}
            </p>
            <p>
              <UrgencyBadge level={currentPatient.urgencyLevel} />
            </p>
            <div className="flex justify-center space-x-3 mt-4">
              <button 
                onClick={onComplete}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-2 px-4 rounded-md transition-all duration-300"
              >
                <i className="fas fa-check mr-1"></i> Complete
              </button>
              <button 
                onClick={onCancel}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2 px-4 rounded-md transition-all duration-300"
              >
                <i className="fas fa-times mr-1"></i> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UrgencyBadge = ({ level }) => {
  const badges = {
    1: { text: 'Low', class: 'bg-green-900/50 text-green-400 border border-green-800' },
    2: { text: 'Medium', class: 'bg-blue-900/50 text-blue-400 border border-blue-800' },
    3: { text: 'High', class: 'bg-amber-900/50 text-amber-400 border border-amber-800' },
    4: { text: 'Critical', class: 'bg-red-900/50 text-red-400 border border-red-800' }
  };

  const badge = badges[level] || badges[1];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.class}`}>
      {badge.text}
    </span>
  );
};

export default NowServing;
