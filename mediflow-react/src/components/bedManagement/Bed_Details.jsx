import React from 'react';
import Button from '../common/Button';

const statusColors = {
  available: 'bg-green-600',
  occupied: 'bg-red-600',
  maintenance: 'bg-amber-500',
  reserved: 'bg-blue-500'
};

const BedDetails = ({ bed, onClose, onUpdateStatus }) => {
  if (!bed) {
    return (
      <div className="text-center p-10">
        <i className="fas fa-bed fa-3x text-gray-600 mb-3"></i>
        <p className="text-lg text-gray-400">Select a bed to view details</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-white font-semibold ${statusColors[bed.status]}`}>{bed.label}</span>
        <span className="text-sm text-gray-400">{bed.ward}</span>
      </div>
      <div className="mb-3">
        <span className="font-medium">Status: </span>
        <span className={`px-2 py-1 text-xs rounded-full text-white ${statusColors[bed.status]}`}>{bed.status.toUpperCase()}</span>
      </div>
      {bed.patientName && (
        <div className="mb-3">
          <span className="font-medium">Patient: </span>
          <span>{bed.patientName}</span>
        </div>
      )}
      <div className="mb-3">
        <span className="font-medium">Last Cleaned: </span>
        <span>{bed.lastCleaned || 'N/A'}</span>
      </div>
      <div className="flex space-x-2 mt-4">
        <Button variant="success" onClick={() => onUpdateStatus(bed, 'available')} icon="fas fa-check">
          Mark Available
        </Button>
        <Button variant="warning" onClick={() => onUpdateStatus(bed, 'maintenance')} icon="fas fa-tools">
          Maintenance
        </Button>
        <Button variant="outline" onClick={onClose} icon="fas fa-times">
          Close
        </Button>
      </div>
    </div>
  );
};

export default BedDetails;
