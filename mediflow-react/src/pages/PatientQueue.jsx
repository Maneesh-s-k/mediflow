// src/pages/PatientQueue.jsx
import React, { useState, useEffect } from 'react';
import { addPatientToQueue, fetchPatientQueue, updatePatientStatus, removePatientFromQueue } from '../api/patientApi';
import AddPatientQueueForm from '../components/patientQueue/AddPatientQueueForm';
import Button from '../components/common/Button';
import QueueTable from '../components/patientQueue/QueueTable';
import NowServing from '../components/patientQueue/NowServing';
import DepartmentLoadList from '../components/patientQueue/Department_LoadList';

const PatientQueue = () => {
  const [patients, setPatients] = useState([]);
  const [currentPatients, setCurrentPatients] = useState([]); // changed to array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, waiting: 0, avgWaitTime: 0 });

  useEffect(() => {
    loadPatientQueue();
    const interval = setInterval(loadPatientQueue, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPatientQueue = async () => {
    try {
      setLoading(true);
      const patients = await fetchPatientQueue();
      setPatients(patients);

      // Find all current patients (status: 'InService')
      const inServicePatients = patients.filter(p => p.status === 'InService');
      setCurrentPatients(inServicePatients);

      // Calculate stats for waiting patients
      const waitingPatients = patients.filter(p => p.status === 'Waiting');
      const total = waitingPatients.length;
      const avgWaitTime = total > 0
        ? Math.round(waitingPatients.reduce((sum, p) => sum + p.estimatedWaitTime, 0) / total)
        : 0;
      setStats({ total, waiting: total, avgWaitTime });
    } catch (error) {
      setError('Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData) => {
    try {
      await addPatientToQueue(patientData);
      await loadPatientQueue();
      setShowAddForm(false);
      return true;
    } catch (error) {
      console.error('Error adding patient:', error);
      return false;
    }
  };

  const handleCallNext = async () => {
    const waitingList = patients.filter(p => p.status === 'Waiting');
    if (waitingList.length === 0) {
      alert('No patients in queue');
      return;
    }
    const nextPatient = waitingList[0];
    try {
      await updatePatientStatus(nextPatient._id, 'InService');
      await loadPatientQueue();
    } catch (error) {
      console.error('Error calling next patient:', error);
      alert('Error calling next patient. Please try again.');
    }
  };

  const handleCompleteService = async (patientId) => {
    try {
      await updatePatientStatus(patientId, 'Completed');
      await loadPatientQueue();
    } catch (error) {
      console.error('Error completing service:', error);
      alert('Error completing service. Please try again.');
    }
  };

  const handleCancelService = async (patientId) => {
    try {
      await updatePatientStatus(patientId, 'Waiting');
      await loadPatientQueue();
    } catch (error) {
      console.error('Error canceling service:', error);
      alert('Error canceling service. Please try again.');
    }
  };

  const handleRemovePatient = async (patientId) => {
    if (!window.confirm('Are you sure you want to remove this patient from the queue?')) {
      return;
    }
    try {
      await removePatientFromQueue(patientId);
      await loadPatientQueue();
    } catch (error) {
      console.error('Error removing patient:', error);
      alert('Error removing patient. Please try again.');
    }
  };

  // Only show 'Waiting' patients in the queue table and department load
  const waitingPatients = patients.filter(p => p.status === 'Waiting');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Patient Queue Management</h1>
        <Button
          variant="primary"
          icon="fas fa-plus"
          onClick={() => setShowAddForm(true)}
        >
          Add Patient to Queue
        </Button>
      </div>

      {/* Now Serving Section */}
      <NowServing
        currentPatients={currentPatients}
        onComplete={handleCompleteService}
        onCancel={handleCancelService}
      />

      {/* Department Load List */}
      <DepartmentLoadList patients={waitingPatients} />

      {/* Patient Queue Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700">
        {error && (
          <div className="text-red-500 text-center py-8">
            <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
            <p>{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <QueueTable
            patients={waitingPatients}
            stats={stats}
            onCallPatient={handleCallNext}
            onRemovePatient={handleRemovePatient}
          />
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Patient to Queue</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4">
              <AddPatientQueueForm
                onAddPatient={handleAddPatient}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientQueue;
