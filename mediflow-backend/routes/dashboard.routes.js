// mediflow-backend/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();

// Import models
const Patient = require('../models/patient.model');
const Department = require('../models/department.model');
const Inventory = require('../models/inventory.model');
const User = require('../models/user.model');

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    // Get patient queue count and average wait time
    const waitingPatients = await Patient.find({ status: 'Waiting' });
    const patientQueueCount = waitingPatients.length;
    const totalWaitTime = waitingPatients.reduce((sum, patient) => sum + (patient.estimatedWaitTime || 0), 0);
    const avgWaitTime = patientQueueCount > 0 ? Math.round(totalWaitTime / patientQueueCount) : 0;

    // Get bed status
    const departments = await Department.find();
    const totalCapacity = departments.reduce((sum, dept) => sum + (dept.capacity || 0), 0);
    const totalPatients = departments.reduce((sum, dept) => sum + (dept.currentPatients || 0), 0);
    const availableBeds = totalCapacity - totalPatients;
    const occupancyRate = totalCapacity > 0 ? Math.round((totalPatients / totalCapacity) * 100 * 10) / 10 : 0;

    // Get inventory status
    const lowStockItems = await Inventory.countDocuments({ status: 'low' });
    const criticalItems = await Inventory.countDocuments({ status: 'critical' });

    // Get staff on duty
    const staffOnDuty = await User.countDocuments({ status: 'active' });
    const doctors = await User.countDocuments({ status: 'active', role: 'Doctor' });
    const nurses = await User.countDocuments({ status: 'active', role: 'Nurse' });

    res.json({
      success: true,
      data: {
        patientQueue: {
          count: patientQueueCount,
          avgWaitTime
        },
        bedStatus: {
          available: availableBeds,
          total: totalCapacity,
          occupancyRate
        },
        inventory: {
          lowStock: lowStockItems,
          critical: criticalItems
        },
        staffOnDuty: {
          total: staffOnDuty,
          doctors,
          nurses
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/dashboard/recent-activity
router.get('/recent-activity', async (req, res) => {
    try {
      // Get recent patients with status changes
      const recentPatients = await Patient.find()
        .sort({ updatedAt: -1 })
        .limit(5);
      
      // Transform to activity format
      const activities = recentPatients.map(patient => {
        let activity = 'Check-in';
        if (patient.status === 'InService') activity = 'In Treatment';
        if (patient.status === 'Completed') activity = 'Completed';
        if (patient.status === 'Cancelled') activity = 'Cancelled';
  
        // Calculate time ago
        const updatedAt = patient.updatedAt ? new Date(patient.updatedAt) : new Date();
        const now = new Date();
        const diffInMinutes = Math.floor((now - updatedAt) / 60000);
        let timeAgo = `${diffInMinutes} min ago`;
        if (diffInMinutes > 60) {
          timeAgo = `${Math.floor(diffInMinutes / 60)} hr ago`;
        }
  
        return {
          id: patient._id,
          patient: {
            name: patient.name || 'Unknown',
            initials: patient.name ? patient.name.split(' ').map(n => n[0]).join('') : 'U'
          },
          activity,
          department: patient.department || 'Unknown',
          time: timeAgo,
          status: patient.status === 'Completed' ? 'Completed' :
            patient.status === 'InService' ? 'In Progress' :
            patient.status === 'Cancelled' ? 'Cancelled' : 'Pending'
        };
      });
  
      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });
  

// GET /api/dashboard/metrics
router.get('/metrics', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'week';
    const now = new Date();
    let startDate;
    if (timeframe === 'day') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeframe === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === 'month') {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7); // Default to week
    }

    // Get admissions and discharges in the time period
    const admissions = await Patient.countDocuments({
      status: { $in: ['Admitted', 'InService'] },
      createdAt: { $gte: startDate }
    });
    const discharges = await Patient.countDocuments({
      status: 'Completed',
      updatedAt: { $gte: startDate }
    });

    // Calculate average stay duration for discharged patients
    const completedPatients = await Patient.find({
      status: 'Completed',
      updatedAt: { $gte: startDate }
    });

    let averageStay = 0;
    if (completedPatients.length > 0) {
      const totalStayHours = completedPatients.reduce((sum, patient) => {
        const admitTime = new Date(patient.createdAt);
        const dischargeTime = new Date(patient.updatedAt);
        const stayHours = (dischargeTime - admitTime) / (1000 * 60 * 60);
        return sum + stayHours;
      }, 0);
      averageStay = Math.round(totalStayHours / completedPatients.length * 10) / 10;
    }

    // Get occupancy rate over time
    const departments = await Department.find();
    const totalCapacity = departments.reduce((sum, dept) => sum + (dept.capacity || 0), 0);
    const currentOccupancy = departments.reduce((sum, dept) => sum + (dept.currentPatients || 0), 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;

    res.json({
      success: true,
      data: {
        timeframe,
        admissions,
        discharges,
        occupancyRate,
        averageStay,
        // In a real implementation, you would include time series data here
        occupancyTrend: [65, 67, 70, 72, 68, 66, occupancyRate] // Sample data
      }
    });
  } catch (error) {
    console.error('Error fetching hospital metrics:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
