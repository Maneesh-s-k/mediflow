import React from 'react';
import Button from '../common/Button';

const AdmissionDetails = ({ admission, onClose, onDischarge }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Admission Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="bg-gray-800/30 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-400">Admission ID</span>
            <p className="font-mono font-medium">{admission.admissionId}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            admission.status === 'Active' ? 'bg-green-900/50 text-green-300 border border-green-800' :
            admission.status === 'Discharged' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
            'bg-gray-900/50 text-gray-300 border border-gray-800'
          }`}>
            {admission.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-400">Patient</span>
            <p className="font-medium">{admission.patientName}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Admission Type</span>
            <p className="font-medium">{admission.admissionType}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Admission Date</span>
            <p className="font-medium">{new Date(admission.admissionDate).toLocaleString()}</p>
          </div>
          {admission.dischargeDate && (
            <div>
              <span className="text-sm text-gray-400">Discharge Date</span>
              <p className="font-medium">{new Date(admission.dischargeDate).toLocaleString()}</p>
            </div>
          )}
          <div>
            <span className="text-sm text-gray-400">Bed Assignment</span>
            <p className="font-medium">
              {admission.assignedBed ? 
                `${admission.assignedBed.bedId} (${admission.assignedBed.location.ward}, ${admission.assignedBed.location.room})` : 
                'Not assigned'}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Attending Physician</span>
            <p className="font-medium">{admission.attendingPhysician}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/30 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Medical Details</h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-400">Admission Reason</span>
            <p className="mt-1">{admission.admissionReason}</p>
          </div>
          {admission.diagnosisCodes && admission.diagnosisCodes.length > 0 && (
            <div>
              <span className="text-sm text-gray-400">Diagnosis Codes</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {admission.diagnosisCodes.map((code, index) => (
                  <span key={index} className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}
          {admission.notes && (
            <div>
              <span className="text-sm text-gray-400">Notes</span>
              <p className="mt-1 whitespace-pre-line">{admission.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      {admission.insuranceDetails && (
        <div className="bg-gray-800/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Insurance Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-400">Provider</span>
              <p className="font-medium">{admission.insuranceDetails.provider}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Policy Number</span>
              <p className="font-medium">{admission.insuranceDetails.policyNumber}</p>
            </div>
          </div>
        </div>
      )}
      
      {admission.status === 'Active' && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            icon="fas fa-sign-out-alt"
            onClick={onDischarge}
          >
            Discharge Patient
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdmissionDetails;
