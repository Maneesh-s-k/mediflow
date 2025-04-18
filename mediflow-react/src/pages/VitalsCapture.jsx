import React, { useState } from 'react';
import Card from '../components/common/Card';
import PatientInfoForm from '../components/vitalsCapture/PatientInfoForm';
import VitalsForm from '../components/vitalsCapture/VitalsForm';
import TriageResult from '../components/vitalsCapture/TriageResult';
import { addPatientToQueue } from '../services/api';

const VitalsCapture = () => {
  const [currentStep, setCurrentStep] = useState('patientInfo'); // patientInfo, vitals, result
  const [patientInfo, setPatientInfo] = useState(null);
  const [vitalsData, setVitalsData] = useState(null);
  const [triageResult, setTriageResult] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  const handlePatientInfoSubmit = (info) => {
    setPatientInfo(info);
    setCurrentStep('vitals');
  };

  const handleVitalsSubmit = (vitals) => {
    setVitalsData(vitals);
    
    // Perform AI triage based on vitals and patient info
    const triageResult = performAITriage(patientInfo, vitals);
    setTriageResult(triageResult);
    
    // Generate token and estimated wait time
    const token = generateToken();
    const estimatedWaitTime = calculateWaitTime(triageResult.urgencyLevel, patientInfo.department);
    setTokenInfo({ token, estimatedWaitTime });
    
    // Add patient to queue
    addPatientToQueue({
      name: patientInfo.name,
      age: patientInfo.age,
      gender: patientInfo.gender,
      department: patientInfo.department,
      urgencyLevel: triageResult.urgencyLevel,
      symptoms: patientInfo.chiefComplaint,
      vitals: {
        bloodPressure: `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`,
        temperature: vitals.temperature,
        heartRate: vitals.heartRate,
        oxygenSaturation: vitals.oxygenSaturation,
        respiratoryRate: vitals.respiratoryRate
      },
      token,
      estimatedWaitTime
    }).catch(error => {
      console.error('Error adding patient to queue:', error);
    });
    
    setCurrentStep('result');
  };

  const handlePrintToken = () => {
    alert(`Printing token ${tokenInfo.token} for ${patientInfo.name}`);
    // In a real app, this would trigger a print dialog or send to a printer
  };

  const handleSendSMS = () => {
    alert(`SMS sent to patient with token ${tokenInfo.token} and wait time information`);
    // In a real app, this would integrate with an SMS gateway
  };

  const handleNewPatient = () => {
    // Reset all state
    setPatientInfo(null);
    setVitalsData(null);
    setTriageResult(null);
    setTokenInfo(null);
    setCurrentStep('patientInfo');
  };

  // Helper function to perform AI triage
  const performAITriage = (patient, vitals) => {
    // In a real application, this would be a sophisticated ML model
    // For this demo, we'll use a rule-based approach
    
    // Parse values
    const systolic = parseInt(vitals.bloodPressureSystolic);
    const diastolic = parseInt(vitals.bloodPressureDiastolic);
    const hr = parseInt(vitals.heartRate);
    const temp = parseFloat(vitals.temperature);
    const o2 = parseInt(vitals.oxygenSaturation);
    const rr = parseInt(vitals.respiratoryRate);
    
    // Initialize score (higher = more urgent)
    let urgencyScore = 0;
    
    // Check blood pressure
    if (systolic >= 180 || diastolic >= 120) {
      urgencyScore += 3; // Hypertensive crisis
    } else if (systolic >= 140 || diastolic >= 90) {
      urgencyScore += 1; // Hypertension
    } else if (systolic < 90 || diastolic < 60) {
      urgencyScore += 2; // Hypotension
    }
    
    // Check heart rate
    if (hr > 120) {
      urgencyScore += 2; // Tachycardia
    } else if (hr < 50) {
      urgencyScore += 2; // Bradycardia
    }
    
    // Check temperature
    if (temp >= 103) {
      urgencyScore += 3; // High fever
    } else if (temp >= 100.4) {
      urgencyScore += 1; // Fever
    } else if (temp < 95) {
      urgencyScore += 3; // Hypothermia
    }
    
    // Check oxygen saturation
    if (o2 < 90) {
      urgencyScore += 4; // Severe hypoxemia
    } else if (o2 < 94) {
      urgencyScore += 2; // Moderate hypoxemia
    }
    
    // Check respiratory rate
    if (rr > 30) {
      urgencyScore += 3; // Severe tachypnea
    } else if (rr > 20) {
      urgencyScore += 1; // Mild tachypnea
    } else if (rr < 8) {
      urgencyScore += 3; // Bradypnea
    }
    
    // Check chief complaint for keywords indicating urgency
    const urgentKeywords = [
      'chest pain', 'difficulty breathing', 'shortness of breath', 
      'severe pain', 'bleeding', 'stroke', 'unconscious', 'seizure',
      'heart attack', 'trauma', 'head injury', 'broken', 'fracture'
    ];
    
    const complaint = patient.chiefComplaint.toLowerCase();
    for (const keyword of urgentKeywords) {
      if (complaint.includes(keyword)) {
        urgencyScore += 2;
        break;
      }
    }
    
    // Check age (elderly and very young get higher priority)
    if (patient.age < 5 || patient.age > 75) {
      urgencyScore += 1;
    }
    
    // Determine urgency level based on score
    let urgencyLevel, message;
    
    if (urgencyScore >= 8) {
      urgencyLevel = 4;
      message = 'This patient requires immediate medical attention.';
    } else if (urgencyScore >= 5) {
      urgencyLevel = 3;
      message = 'This patient requires urgent care.';
    } else if (urgencyScore >= 2) {
      urgencyLevel = 2;
      message = 'This patient requires standard priority care.';
    } else {
      urgencyLevel = 1;
      message = 'This patient can be seen in regular order.';
    }
    
    return {
      urgencyLevel,
      message,
      score: urgencyScore
    };
  };

  // Helper function to generate a token
  const generateToken = () => {
    return `A${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Helper function to calculate estimated wait time
  const calculateWaitTime = (urgencyLevel, department) => {
    // Base wait times by department (in minutes)
    const departmentWaitTimes = {
      'General Medicine': 30,
      'Cardiology': 45,
      'Orthopedics': 40,
      'Pediatrics': 25,
      'Neurology': 50,
      'Emergency': 15
    };
    
    // Adjust by urgency level
    const urgencyMultipliers = {
      1: 1.5,    // Low priority - longer wait
      2: 1.0,    // Medium priority - standard wait
      3: 0.6,    // High priority - shorter wait
      4: 0.3     // Critical - very short wait
    };
    
    // Calculate base wait time
    let waitTime = departmentWaitTimes[department] || 30;
    
    // Apply urgency multiplier
    waitTime *= urgencyMultipliers[urgencyLevel] || 1.0;
    
    // Add some randomness (±5 minutes)
    waitTime += Math.floor(Math.random() * 10) - 5;
    
    // Ensure wait time is positive
    return Math.max(5, Math.round(waitTime));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card 
        title="Patient Vitals Capture" 
        icon="fas fa-heartbeat"
        gradient="from-blue-900 to-blue-800"
      >
        {currentStep === 'patientInfo' && (
          <PatientInfoForm onContinue={handlePatientInfoSubmit} />
        )}
        
        {currentStep === 'vitals' && (
          <VitalsForm 
            patientName={patientInfo.name} 
            onSubmit={handleVitalsSubmit} 
          />
        )}
        
        {currentStep === 'result' && (
          <TriageResult 
            patientInfo={patientInfo}
            vitals={vitalsData}
            triageResult={triageResult}
            tokenInfo={tokenInfo}
            onPrintToken={handlePrintToken}
            onSendSMS={handleSendSMS}
            onNewPatient={handleNewPatient}
          />
        )}
      </Card>
    </div>
  );
};

export default VitalsCapture;
