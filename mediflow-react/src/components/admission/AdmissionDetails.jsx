import React from 'react';
import Button from '../common/Button';

const AdmissionDetails = ({ admission, onClose, onDischarge }) => {
  if (!admission) {
    return (
      <div className="text-center p-10">
        <i className="fas fa-clipboard-list fa-3x text-gray-600 mb-3"></i>
        <p className="text-lg text-gray-400">Select an admission to view details</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h6 className="text-sm font-medium mb-3 text-blue-400">Patient Information</h6>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {admission.patientName}</p>
            <p><span className="font-medium">Age/Gender:</span> {admission.age}/{admission.gender?.charAt(0)}</p>
            <p><span className="font-medium">Contact:</span> {admission.contactNumber}</p>
            <p><span className="font-medium">Emergency Contact:</span> {admission.emergencyContact || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h6 className="text-sm font-medium mb-3 text-blue-400">Admission Information</h6>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">ID:</span> {admission.id}</p>
            <p><span className="font-medium">Type:</span> {admission.admissionType}</p>
            <p><span className="font-medium">Department:</span> {admission.department}</p>
            <p><span className="font-medium">Doctor:</span> {admission.attendingDoctor}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h6 className="text-sm font-medium mb-3 text-blue-400">Medical Information</h6>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Diagnosis:</span> {admission.diagnosis}</p>
            <p><span className="font-medium">Ward:</span> {admission.wardType}</p>
            <p><span className="font-medium">Bed:</span> {admission.bedId || '-'}</p>
            <p><span className="font-medium">Insurance:</span> {admission.insuranceInfo || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h6 className="text-sm font-medium mb-3 text-blue-400">Notes</h6>
          <p className="text-sm">{admission.notes || 'No additional notes.'}</p>
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} icon="fas fa-times">
          Close
        </Button>
        <Button variant="success" onClick={() => onDischarge(admission)} icon="fas fa-check-circle">
          Discharge
        </Button>
      </div>
    </div>
  );
};

export default AdmissionDetails;
