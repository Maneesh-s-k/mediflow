// routes/patient.routes.js
const express = require('express');
const router = express.Router();

// Import Patient model (create this if you haven't already)
const Patient = require('../models/patient.model');

// Get patient queue
// GET /api/patients/queue/status
router.get('/queue/status', async (req, res) => {
  try {
    // Fetch patients in queue from MongoDB
    const patients = await Patient.find({ status: 'Waiting' })
      .sort({ urgencyLevel: -1, arrivalTime: 1 }); // Sort by urgency (desc) and arrival time (asc)
    
    // Calculate statistics
    const count = patients.length;
    const avgWaitTime = patients.length > 0 
      ? Math.round(patients.reduce((sum, p) => sum + p.estimatedWaitTime, 0) / patients.length) 
      : 0;
    
    // Group by department for department load
    const byDepartment = [];
    const deptCounts = {};
    
    patients.forEach(patient => {
      const dept = patient.department;
      if (!deptCounts[dept]) {
        deptCounts[dept] = {
          department: dept,
          count: 0,
          avgWait: 0,
          totalWait: 0
        };
      }
      deptCounts[dept].count++;
      deptCounts[dept].totalWait += patient.estimatedWaitTime;
    });
    
    // Calculate average wait time per department
    Object.keys(deptCounts).forEach(dept => {
      deptCounts[dept].avgWait = Math.round(deptCounts[dept].totalWait / deptCounts[dept].count);
      byDepartment.push(deptCounts[dept]);
    });
    
    res.json({
      success: true,
      data: {
        count,
        avgWaitTime,
        byDepartment,
        patients
      }
    });
  } catch (error) {
    console.error('Error fetching patient queue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add patient to queue
// POST /api/patients/queue
router.post('/queue', async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      department,
      urgencyLevel,
      symptoms,
      vitals,
      token,
      estimatedWaitTime
    } = req.body;
    
    // Create new patient in MongoDB
    const newPatient = new Patient({
      name,
      age,
      gender,
      department,
      urgencyLevel,
      symptoms,
      vitals,
      token,
      estimatedWaitTime,
      arrivalTime: new Date(),
      status: 'Waiting'
    });
    
    await newPatient.save();
    
    res.status(201).json({
      success: true,
      message: 'Patient added to queue successfully',
      data: newPatient
    });
  } catch (error) {
    console.error('Error adding patient to queue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update patient status (for calling next, completing service, etc.)
// PATCH /api/patients/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Waiting', 'InService', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'InService' ? { serviceStartTime: new Date() } : {})
      },
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error updating patient status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Remove patient from queue
// DELETE /api/patients/:id
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Patient removed from queue'
    });
  } catch (error) {
    console.error('Error removing patient:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
