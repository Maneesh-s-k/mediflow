import React from 'react';
import Button from '../common/Button';

const TriageResult = ({ 
  patientInfo, 
  vitals, 
  triageResult, 
  tokenInfo, 
  onPrintToken, 
  onSendSMS, 
  onNewPatient 
}) => {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <i className="fas fa-clipboard-check text-4xl text-emerald-500 mb-3"></i>
        <h5 className="text-xl font-medium">Triage Assessment Complete</h5>
      </div>
      
      <div className="space-y-4">
        {/* Patient Information */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h6 className="text-sm font-medium mb-2 text-blue-400">Patient Information</h6>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {patientInfo.name}</p>
            <p><span className="font-medium">Age/Gender:</span> {patientInfo.age}/{patientInfo.gender.charAt(0)}</p>
            <p><span className="font-medium">Department:</span> {patientInfo.department}</p>
            <p><span className="font-medium">Chief Complaint:</span> {patientInfo.chiefComplaint}</p>
          </div>
        </div>
        
        {/* Vital Signs */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h6 className="text-sm font-medium mb-2 text-blue-400">Vital Signs</h6>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-gray-400">Blood Pressure</p>
              <p className="font-medium">{vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic} mmHg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Heart Rate</p>
              <p className="font-medium">{vitals.heartRate} bpm</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Temperature</p>
              <p className="font-medium">{vitals.temperature} °F</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">SpO₂</p>
              <p className="font-medium">{vitals.oxygenSaturation}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Respiratory Rate</p>
              <p className="font-medium">{vitals.respiratoryRate} breaths/min</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">BMI</p>
              <p className="font-medium">{vitals.bmi || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {/* AI Triage Assessment */}
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <h6 className="text-sm font-medium mb-3 text-blue-400">AI Triage Assessment</h6>
          <div className="my-3">
            <UrgencyBadge urgency={triageResult.urgencyLevel} />
          </div>
          <p className="text-sm">{triageResult.message}</p>
        </div>
        
        {/* Queue Information */}
        <div className="bg-gray-700/50 rounded-lg p-4 text-center">
          <h6 className="text-sm font-medium mb-3 text-blue-400">Queue Information</h6>
          <h3 className="text-2xl font-bold text-blue-400 mb-2">Token: {tokenInfo.token}</h3>
          <p className="mb-1">Estimated Wait Time: <span className="font-medium">{tokenInfo.estimatedWaitTime} minutes</span></p>
          <p className="mb-4">Please proceed to the <span className="font-medium">{patientInfo.department}</span> waiting area.</p>
          <div className="flex justify-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrintToken}
              icon="fas fa-print"
            >
              Print Token
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSendSMS}
              icon="fas fa-sms"
            >
              Send SMS
            </Button>
          </div>
        </div>
        
        {/* New Patient Button */}
        <Button 
          variant="primary" 
          className="w-full" 
          onClick={onNewPatient}
          icon="fas fa-user-plus"
        >
          New Patient
        </Button>
      </div>
    </div>
  );
};

const UrgencyBadge = ({ urgency }) => {
  const badges = {
    1: { text: 'Low Priority', class: 'bg-green-900/50 border border-green-700' },
    2: { text: 'Medium Priority', class: 'bg-amber-900/50 border border-amber-700' },
    3: { text: 'High Priority', class: 'bg-orange-900/50 border border-orange-700' },
    4: { text: 'Critical', class: 'bg-red-900/50 border border-red-700' }
  };

  const badge = badges[urgency] || badges[1];

  return (
    <span className={`px-3 py-2 text-base font-medium rounded-md ${badge.class}`}>
      {badge.text}
    </span>
  );
};

export default TriageResult;
