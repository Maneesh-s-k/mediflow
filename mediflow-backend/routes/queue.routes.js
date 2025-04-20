const express = require('express');
const router = express.Router();
const Patient = require('../models/patient.model');

// Helper function
function calculateEstimatedWaitTime(department, urgencyLevel) {
  const departmentWaitTimes = {
    'General Medicine': 30,
    'Cardiology': 45,
    'Orthopedics': 40,
    'Pediatrics': 25,
    'Neurology': 50,
    'Emergency': 15
  };
  const urgencyMultipliers = { 1: 1.5, 2: 1.0, 3: 0.6, 4: 0.3 };
  let waitTime = departmentWaitTimes[department] || 30;
  waitTime *= urgencyMultipliers[urgencyLevel] || 1.0;
  waitTime += Math.floor(Math.random() * 10) - 5;
  return Math.max(5, Math.round(waitTime));
}

// GET /api/queue/status
router.get('/status', async (req, res) => {
  try {
    const patients = await Patient.find({ status: 'Waiting' })
      .sort({ urgencyLevel: -1, arrivalTime: 1 });

    const count = patients.length;
    const avgWaitTime = count > 0
      ? Math.round(patients.reduce((sum, p) => sum + p.estimatedWaitTime, 0) / count)
      : 0;

    const byDepartment = [];
    const deptCounts = {};

    patients.forEach(patient => {
      const dept = patient.department;
      if (!deptCounts[dept]) {
        deptCounts[dept] = { department: dept, count: 0, avgWait: 0, totalWait: 0 };
      }
      deptCounts[dept].count++;
      deptCounts[dept].totalWait += patient.estimatedWaitTime;
    });

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

// POST /api/queue/add
router.post('/add', async (req, res) => {
  try {
    const {
      name, age, gender, contact, department,
      urgencyLevel, symptoms, token, estimatedWaitTime
    } = req.body;

    if (!name || !age || !gender || !contact || !department) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    const newPatient = new Patient({
      name,
      age,
      gender,
      contact,
      department,
      urgencyLevel: urgencyLevel || 1,
      symptoms: symptoms || '',
      token: token || `Q${Math.floor(1000 + Math.random() * 9000)}`,
      estimatedWaitTime: estimatedWaitTime || calculateEstimatedWaitTime(department, urgencyLevel),
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

// PATCH /api/queue/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Waiting', 'InService', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be Waiting, InService, Completed, or Cancelled'
      });
    }

    const updateFields = { status };
    if (status === 'InService') {
      updateFields.serviceStartTime = new Date();
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updateFields,
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

// DELETE /api/queue/:id
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
      message: 'Patient removed from queue',
      data: patient
    });
  } catch (error) {
    console.error('Error removing patient from queue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
