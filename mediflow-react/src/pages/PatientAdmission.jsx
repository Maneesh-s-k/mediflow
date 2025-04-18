import React, { useState } from 'react';
import Card from '../components/common/Card';
import AdmissionForm from '../components/admission/AdmissionForm';
import AdmissionsTable from '../components/admission/AdmissionsTable';
import AdmissionDetails from '../components/admission/AdmissionDetails';

const PatientAdmission = () => {
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const handleAdmit = (form) => {
    const newAdmission = {
      ...form,
      id: `ADM${Math.floor(1000 + Math.random() * 9000)}`,
      admissionDate: new Date().toISOString(),
      bedId: form.wardType.slice(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900)
    };
    setAdmissions([newAdmission, ...admissions]);
    alert(`Patient ${form.patientName} admitted successfully!`);
  };

  const handleView = (admission) => {
    setSelectedAdmission(admission);
  };

  const handleCloseDetails = () => {
    setSelectedAdmission(null);
  };

  const handleDischarge = (admission) => {
    if (window.confirm(`Discharge patient ${admission.patientName}?`)) {
      setAdmissions(admissions.filter(a => a.id !== admission.id));
      setSelectedAdmission(null);
      alert('Patient discharged!');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <Card title="Patient Admission" icon="fas fa-procedures" gradient="from-blue-900 to-blue-800">
          <AdmissionForm onAdmit={handleAdmit} />
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Card title="Recent Admissions" icon="fas fa-history" gradient="from-emerald-900 to-emerald-800">
          <AdmissionsTable admissions={admissions} onView={handleView} />
        </Card>
        <Card title="Admission Details" icon="fas fa-info-circle" gradient="from-blue-900 to-blue-800">
          <AdmissionDetails admission={selectedAdmission} onClose={handleCloseDetails} onDischarge={handleDischarge} />
        </Card>
      </div>
    </div>
  );
};

export default PatientAdmission;
