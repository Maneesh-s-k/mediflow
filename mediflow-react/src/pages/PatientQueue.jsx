// src/pages/PatientQueue.jsx
import React, { useState, useEffect } from 'react';
import { fetchPatientQueue, addPatientToQueue } from '../services/api';
import AddPatientForm from '../components/patientQueue/AddPatientForm';
import QueueTable from '../components/patientQueue/QueueTable';
import NowServing from '../components/patientQueue/NowServing';
import DepartmentLoadList from '../components/patientQueue/Department_LoadList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const PatientQueue = () => {
  const [patientQueue, setPatientQueue] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [stats, setStats] = useState({ total: 0, waiting: 0, avgWaitTime: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadPatientQueue();
    // Refresh data every minute
    const interval = setInterval(loadPatientQueue, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPatientQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPatientQueue();
      
      // Transform data if needed
      const queueData = Array.isArray(data) ? data : [];
      
      setPatientQueue(queueData);
      
      // Calculate stats
      const total = queueData.length;
      const waiting = queueData.length;
      const totalWaitTime = queueData.reduce((sum, patient) => sum + (patient.estimatedWaitTime || 0), 0);
      const avgWaitTime = total > 0 ? Math.round(totalWaitTime / total) : 0;
      
      setStats({ total, waiting, avgWaitTime });
      setLoading(false);
    } catch (err) {
      console.error('Failed to load patient queue:', err);
      setError('Failed to load patient queue. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddPatient = async (newPatient) => {
    try {
      await addPatientToQueue(newPatient);
      await loadPatientQueue();
      setShowAddForm(false);
      return true;
    } catch (error) {
      console.error('Error adding patient:', error);
      return false;
    }
  };

  const handleCallNext = () => {
    if (patientQueue.length === 0) {
      alert('No patients in queue');
      return;
    }
    
    // Get the highest priority patient (first in the sorted queue)
    const nextPatient = patientQueue[0];
    setCurrentPatient(nextPatient);
    
    // Remove from queue
    setPatientQueue(prevQueue => prevQueue.filter(p => p.id !== nextPatient.id));
    
    // Update stats
    setStats(prev => ({ ...prev, total: prev.total, waiting: prev.waiting - 1 }));
  };

  const handleCompleteService = () => {
    if (!currentPatient) {
      alert('No patient currently being served');
      return;
    }
    setCurrentPatient(null);
  };

  const handleCancelService = () => {
    if (!currentPatient) {
      alert('No patient currently being served');
      return;
    }
    
    // Add back to queue
    setPatientQueue(prevQueue => [...prevQueue, currentPatient].sort((a, b) => {
      // Sort by urgency level (descending) and then by arrival time (ascending)
      if (b.urgencyLevel !== a.urgencyLevel) {
        return b.urgencyLevel - a.urgencyLevel;
      }
      return new Date(a.arrivalTime) - new Date(b.arrivalTime);
    }));
    
    // Update stats
    setStats(prev => ({ ...prev, waiting: prev.waiting + 1 }));
    setCurrentPatient(null);
  };

  const handleRemovePatient = (patientId) => {
    if (!window.confirm('Are you sure you want to remove this patient from the queue?')) {
      return;
    }
    setPatientQueue(prevQueue => prevQueue.filter(p => p.id !== patientId));
    // Update stats
    setStats(prev => ({ ...prev, total: prev.total - 1, waiting: prev.waiting - 1 }));
  };

  const handleCallSpecific = (patientId) => {
    const patient = patientQueue.find(p => p.id === patientId);
    if (!patient) {
      alert('Patient not found in queue');
      return;
    }
    setCurrentPatient(patient);
    setPatientQueue(prevQueue => prevQueue.filter(p => p.id !== patientId));
    // Update stats
    setStats(prev => ({ ...prev, waiting: prev.waiting - 1 }));
  };

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NowServing 
            currentPatient={currentPatient} 
            onCallNext={handleCallNext} 
            onComplete={handleCompleteService} 
            onCancel={handleCancelService} 
          />
          
          <Card title="Patient Queue" icon="fas fa-list-ol" gradient="from-blue-900 to-blue-800">
            {loading ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-red-400 text-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            ) : (
              <QueueTable 
                patients={patientQueue} 
                stats={stats} 
                onCallPatient={handleCallSpecific} 
                onRemovePatient={handleRemovePatient} 
              />
            )}
          </Card>
        </div>
        
        <div>
          <Card title="Department Load" icon="fas fa-chart-pie" gradient="from-purple-900 to-purple-800">
            <DepartmentLoadList patients={patientQueue} />
          </Card>
        </div>
      </div>
      
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
              <AddPatientForm onAddPatient={handleAddPatient} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientQueue;
