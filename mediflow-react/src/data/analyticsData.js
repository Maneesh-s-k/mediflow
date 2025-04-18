// Sample data for analytics
export const patientFlowData = {
    daily: [
      { date: '2025-04-12', admissions: 24, discharges: 21, emergency: 15 },
      { date: '2025-04-13', admissions: 18, discharges: 22, emergency: 12 },
      { date: '2025-04-14', admissions: 22, discharges: 19, emergency: 18 },
      { date: '2025-04-15', admissions: 27, discharges: 23, emergency: 14 },
      { date: '2025-04-16', admissions: 25, discharges: 26, emergency: 16 },
      { date: '2025-04-17', admissions: 30, discharges: 25, emergency: 20 },
      { date: '2025-04-18', admissions: 28, discharges: 29, emergency: 17 }
    ]
  };
  
  export const departmentUtilizationData = [
    { department: 'Cardiology', patients: 45, capacity: 50, utilization: 90 },
    { department: 'Neurology', patients: 28, capacity: 35, utilization: 80 },
    { department: 'Orthopedics', patients: 32, capacity: 40, utilization: 80 },
    { department: 'Pediatrics', patients: 18, capacity: 30, utilization: 60 },
    { department: 'General Medicine', patients: 52, capacity: 60, utilization: 87 },
    { department: 'Emergency', patients: 15, capacity: 20, utilization: 75 }
  ];
  
  export const resourceUtilizationData = {
    beds: { total: 200, occupied: 165, available: 35, utilization: 82.5 },
    staff: { doctors: 45, nurses: 120, technicians: 30, admin: 25 },
    inventory: { total: 520, lowStock: 48, critical: 12 }
  };
  
  export const waitTimeData = [
    { department: 'Emergency', averageWait: 15, target: 10 },
    { department: 'Cardiology', averageWait: 35, target: 30 },
    { department: 'Neurology', averageWait: 40, target: 30 },
    { department: 'Orthopedics', averageWait: 25, target: 30 },
    { department: 'Pediatrics', averageWait: 20, target: 20 },
    { department: 'General Medicine', averageWait: 45, target: 30 }
  ];
  