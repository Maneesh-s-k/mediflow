// src/pages/PatientQueue.jsx
import React, { useState, useEffect } from 'react';
import { fetchPatientQueue, addPatientToQueue } from '../services/api';
import AddPatientForm from '../components/patientQueue/AddPatientForm';
import QueueTable from '../components/patientQueue/QueueTable';
import NowServing from '../components/patientQueue/NowServing';
import DepartmentLoadList from '../components/patientQueue/Department_LoadList';

const PatientQueue = () => {
  const [patientQueue, setPatientQueue] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    avgWaitTime: 0
  });
  
  useEffect(() => {
    loadPatientQueue();
    
    // Refresh data every minute
    const interval = setInterval(loadPatientQueue, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const loadPatientQueue = async () => {
    const data = await fetchPatientQueue();
    setPatientQueue(data);
    
    // Calculate stats
    const total = data.length;
    const waiting = data.length;
    const totalWaitTime = data.reduce((sum, patient) => sum + patient.estimatedWaitTime, 0);
    const avgWaitTime = total > 0 ? Math.round(totalWaitTime / total) : 0;
    
    setStats({ total, waiting, avgWaitTime });
  };
  
  const handleAddPatient = async (newPatient) => {
    try {
      await addPatientToQueue(newPatient);
      loadPatientQueue();
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
    setStats(prev => ({
      ...prev,
      total: prev.total,
      waiting: prev.waiting - 1
    }));
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
    setStats(prev => ({
      ...prev,
      waiting: prev.waiting + 1
    }));
    
    setCurrentPatient(null);
  };
  
  const handleRemovePatient = (patientId) => {
    if (!window.confirm('Are you sure you want to remove this patient from the queue?')) {
        return;
      }
      
    
    setPatientQueue(prevQueue => prevQueue.filter(p => p.id !== patientId));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      total: prev.total - 1,
      waiting: prev.waiting - 1
    }));
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
    setStats(prev => ({
      ...prev,
      waiting: prev.waiting - 1
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <AddPatientForm onAddPatient={handleAddPatient} />
      </div>
      
      <div className="lg:col-span-2 space-y-6">
        <QueueTable 
          patients={patientQueue} 
          stats={stats}
          onCallPatient={handleCallSpecific}
          onRemovePatient={handleRemovePatient}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NowServing 
            currentPatient={currentPatient}
            onCallNext={handleCallNext}
            onComplete={handleCompleteService}
            onCancel={handleCancelService}
          />
          
          <DepartmentLoadList patients={patientQueue} />
        </div>
      </div>
    </div>
  );
};

export default PatientQueue;
