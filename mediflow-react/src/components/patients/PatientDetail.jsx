// src/components/patients/PatientDetail.jsx
import React from 'react';
import Button from '../common/Button';

const PatientDetail = ({ patient, onClose, onEdit }) => {
  if (!patient) return null;
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-blue-800/50 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-white">Patient Details</h3>
        <button 
          onClick={onClose}
          className="text-gray-300 hover:text-white"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="bg-gray-700/50 rounded-lg p-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white mb-3">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-gray-400">{patient.patientId}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  patient.status === 'Waiting' ? 'bg-amber-900/50 text-amber-300 border border-amber-800' :
                  patient.status === 'In Treatment' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                  patient.status === 'Admitted' ? 'bg-purple-900/50 text-purple-300 border border-purple-800' :
                  'bg-green-900/50 text-green-300 border border-green-800'
                }`}>
                  {patient.status}
                </span>
              </div>
              
              <div className="mt-4 w-full">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={onEdit}
                >
                  Edit Patient
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold uppercase text-gray-400 mb-2">Personal Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400 text-sm">Age:</span>
                    <p>{patient.age} years</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Gender:</span>
                    <p>{patient.gender}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Blood Group:</span>
                    <p>{patient.bloodGroup || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Contact:</span>
                    <p>{patient.contact}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Email:</span>
                    <p>{patient.email || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Address:</span>
                    <p>{patient.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold uppercase text-gray-400 mb-2">Medical Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400 text-sm">Department:</span>
                    <p>{patient.department}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Assigned Doctor:</span>
                    <p>{patient.assignedDoctor ? patient.assignedDoctor.name : 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Admission Date:</span>
                    <p>{patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : 'Not admitted'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Allergies:</span>
                    <p>{patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4 md:col-span-2">
                <h4 className="text-sm font-semibold uppercase text-gray-400 mb-2">Medical History</h4>
                <p className="text-sm">{patient.medicalHistory || 'No medical history recorded.'}</p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4 md:col-span-2">
                <h4 className="text-sm font-semibold uppercase text-gray-400 mb-2">Emergency Contact</h4>
                {patient.emergencyContact ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Name:</span>
                      <p>{patient.emergencyContact.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Relation:</span>
                      <p>{patient.emergencyContact.relation}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Phone:</span>
                      <p>{patient.emergencyContact.phone}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">No emergency contact recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
