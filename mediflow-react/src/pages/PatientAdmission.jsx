import React, { useState, useEffect } from 'react';
import { admitPatient, dischargePatient, fetchActiveAdmissions } from '../api/admissionApi';
import { fetchAvailableBeds } from '../api/bedApi';
import { fetchPatients } from '../api/patientApi';
import AdmissionForm from '../components/admission/AdmissionForm';
import AdmissionsTable from '../components/admission/AdmissionsTable';
import AdmissionDetails from '../components/admission/AdmissionDetails';
import Button from '../components/common/Button';
import PatientSelectionTable from '../components/admission/PatientSelectionTable';

export default function PatientAdmission() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Promise.allSettled to prevent one failed request from failing all
      const [admissionsResult, patientsResult, bedsResult] = await Promise.allSettled([
        fetchActiveAdmissions(),
        fetchPatients(), // This now fetches ALL patients
        fetchAvailableBeds()
      ]);

      // Extract values or empty arrays if rejected
      const admissionsData = admissionsResult.status === 'fulfilled' ? admissionsResult.value : [];
      const patientsData = patientsResult.status === 'fulfilled' ? patientsResult.value : [];
      const bedsData = bedsResult.status === 'fulfilled' ? bedsResult.value : [];

      setAdmissions(admissionsData);
      setPatients(patientsData);
      setAvailableBeds(bedsData);

      // Show warning if any request failed
      if (admissionsResult.status === 'rejected' ||
          patientsResult.status === 'rejected' ||
          bedsResult.status === 'rejected') {
        setError('Some data could not be loaded. Please refresh to try again.');
      }
    } catch (error) {
      console.error('Error loading admission data:', error);
      setError('Failed to load admission data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdmitPatient = async (admissionData) => {
    try {
      setLoading(true);
      
      // Ensure a bed is selected
      if (!admissionData.assignedBed) {
        throw new Error('Please select a bed for the patient');
      }
      
      // Get the patient ID directly without any manipulation
      const patientId = selectedPatient._id;
      
      // Call the API to admit the patient
      await admitPatient({
        patientId,
        ...admissionData,
        patientName: selectedPatient.name,
        admissionType: admissionData.admissionType || 'Planned',
        admissionReason: admissionData.admissionReason || 'Medical care'
      });
      
      // Refresh data
      await loadData();
      setShowAdmissionForm(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error admitting patient:', error);
      setError('Failed to admit patient: ' + (error.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowAdmissionForm(true);
  };

  const handleViewAdmission = (admission) => {
    setSelectedAdmission(admission);
  };

  const handleDischargePatient = async (admissionId) => {
    try {
      setLoading(true);
      await dischargePatient(admissionId);
      await loadData();
      setSelectedAdmission(null);
    } catch (error) {
      console.error('Error discharging patient:', error);
      setError('Failed to discharge patient: ' + (error.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Patient Admission Management</h1>
        <Button
          variant="primary"
          icon="fas fa-plus"
          onClick={() => setShowAdmissionForm(true)}
          disabled={!patients.length || !availableBeds.length}
        >
          New Admission
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {!showAdmissionForm && !selectedAdmission && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Current Admissions</h2>
              <AdmissionsTable
                admissions={admissions}
                onView={handleViewAdmission}
                onDischarge={handleDischargePatient}
              />
              
              <h2 className="text-xl font-semibold mt-8">Available Patients</h2>
              <PatientSelectionTable 
                patients={patients.filter(p => !admissions.some(a => a.patientId === p._id))}
                onSelect={handleSelectPatient}
              />
            </div>
          )}

          {showAdmissionForm && (
            <AdmissionForm
              patient={selectedPatient}
              availableBeds={availableBeds}
              onSubmit={handleAdmitPatient}
              onCancel={() => {
                setShowAdmissionForm(false);
                setSelectedPatient(null);
              }}
            />
          )}

          {selectedAdmission && (
            <AdmissionDetails
              admission={selectedAdmission}
              onClose={() => setSelectedAdmission(null)}
              onDischarge={handleDischargePatient}
            />
          )}
        </>
      )}
    </div>
  );
}
