// src/pages/PatientManagement.jsx
import React, { useState } from 'react';
import PatientList from '../components/patients/PatientList';
import PatientDetail from '../components/patients/PatientDetail';
import Button from '../components/common/Button';

const PatientManagement = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Patient Management</h1>
        <Button 
          variant="primary" 
          icon={<i className="fas fa-plus mr-2"></i>}
          onClick={() => setShowAddPatient(true)}
        >
          Add Patient
        </Button>
      </div>
      
      <div className="space-y-6">
        {selectedPatient ? (
          <PatientDetail 
            patient={selectedPatient} 
            onClose={() => setSelectedPatient(null)}
            onEdit={() => console.log('Edit patient:', selectedPatient)}
          />
        ) : (
          <PatientList onSelectPatient={setSelectedPatient} />
        )}
      </div>
      
      {/* Add Patient Modal would go here */}
    </div>
  );
};

export default PatientManagement;
