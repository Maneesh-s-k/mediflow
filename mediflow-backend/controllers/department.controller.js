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

