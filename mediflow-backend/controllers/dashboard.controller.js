// controllers/dashboard.controller.js
exports.getDashboardStats = (req, res) => {
    // In a real implementation, you would fetch this data from database
    
    const dashboardData = {
      patientQueue: { 
        count: 142, 
        avgWaitTime: 24 
      },
      bedStatus: { 
        available: 35, 
        total: 200,
        occupancyRate: 82.5 
      },
      inventory: { 
        lowStock: 48, 
        critical: 12 
      },
      staffOnDuty: { 
        total: 45, 
        doctors: 12, 
        nurses: 33 
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  };
  
  // Get department load for dashboard
  exports.getDepartmentLoad = (req, res) => {
    // In a real implementation, you would fetch this from database
    const departments = [
      { name: 'Cardiology', capacity: 20, currentPatients: 15, waitTime: 45, staffCount: 5 },
      { name: 'General Medicine', capacity: 20, currentPatients: 12, waitTime: 30, staffCount: 4 },
      { name: 'Emergency', capacity: 20, currentPatients: 17, waitTime: 15, staffCount: 6 },
      { name: 'Pediatrics', capacity: 20, currentPatients: 9, waitTime: 20, staffCount: 3 },
      { name: 'Neurology', capacity: 20, currentPatients: 11, waitTime: 40, staffCount: 4 }
    ];
    
    // Calculate department load percentages
    const departmentsWithLoad = departments.map(dept => ({
      ...dept,
      load: Math.round((dept.currentPatients / dept.capacity) * 100)
    }));
    
    // Find busiest department
    const busiestDept = departmentsWithLoad.reduce((busiest, current) => 
      current.load > busiest.load ? current : busiest, departmentsWithLoad[0]);
    
    // Calculate total capacity and current patients
    const totalCapacity = departments.reduce((sum, dept) => sum + dept.capacity, 0);
    const totalPatients = departments.reduce((sum, dept) => sum + dept.currentPatients, 0);
    const availableCapacity = totalCapacity - totalPatients;
    
    res.json({
      success: true,
      data: {
        departments: departmentsWithLoad,
        summary: {
          busiestDepartment: {
            name: busiestDept.name,
            load: busiestDept.load
          },
          availableCapacity,
          staffDistribution: {
            doctors: 12,
            nurses: 33
          }
        }
      }
    });
  };
  
  // Get recent patient activity for dashboard
  exports.getRecentActivity = (req, res) => {
    // In a real implementation, you would fetch this from database
    const activities = [
      { 
        id: 1, 
        patient: { name: 'John Doe', initials: 'JD' },
        activity: 'Check-in',
        department: 'Cardiology',
        time: '10 min ago',
        status: 'Completed' 
      },
      { 
        id: 2, 
        patient: { name: 'Alice Smith', initials: 'AS' },
        activity: 'Vitals Captured',
        department: 'General Medicine',
        time: '15 min ago',
        status: 'Completed' 
      },
      { 
        id: 3, 
        patient: { name: 'Robert Johnson', initials: 'RJ' },
        activity: 'Admission',
        department: 'Orthopedics',
        time: '25 min ago',
        status: 'In Progress' 
      },
      { 
        id: 4, 
        patient: { name: 'Maria Parker', initials: 'MP' },
        activity: 'Discharge',
        department: 'Pediatrics',
        time: '40 min ago',
        status: 'Completed' 
      },
      { 
        id: 5, 
        patient: { name: 'Thomas Wilson', initials: 'TW' },
        activity: 'Medication',
        department: 'Neurology',
        time: '55 min ago',
        status: 'Pending' 
      }
    ];
    
    res.json({
      success: true,
      data: activities
    });
  };
  