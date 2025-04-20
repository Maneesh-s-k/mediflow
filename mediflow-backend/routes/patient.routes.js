const express = require('express');
const router = express.Router();
const Patient = require('../models/patient.model');

// Helper function to generate a unique patientId
function generatePatientId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `P${y}${m}${d}${h}${min}${s}${rand}`;
}

// GET /api/patients/queue/status
router.get('/queue/status', async (req, res) => {
  try {
    // Return ALL patients so frontend can filter by status
    const patients = await Patient.find({}).sort({ urgencyLevel: -1, arrivalTime: 1 });
    const waitingPatients = patients.filter(p => p.status === 'Waiting');
    const count = waitingPatients.length;
    const avgWaitTime = count > 0
      ? Math.round(waitingPatients.reduce((sum, p) => sum + p.estimatedWaitTime, 0) / count)
      : 0;
    const byDepartment = [];
    const deptCounts = {};
    waitingPatients.forEach(patient => {
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
        patients // return all patients, not just waiting
      }
    });
  } catch (error) {
    console.error('Error fetching patient queue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/patients/queue
router.post('/queue', async (req, res) => {
  try {
    const {
      name, age, gender, contact, department,
      urgencyLevel, symptoms, token, estimatedWaitTime, vitals
    } = req.body;
    // Generate a unique patientId for every new patient
    const patientId = generatePatientId();
    const newPatient = new Patient({
      patientId,
      name,
      age,
      gender,
      contact,
      department,
      urgencyLevel,
      symptoms,
      token,
      estimatedWaitTime,
      arrivalTime: new Date(),
      status: 'Waiting',
      vitals // store vitals object
    });
    await newPatient.save();
    res.status(201).json({
      success: true,
      message: 'Patient added to queue successfully',
      data: newPatient
    });
  } catch (error) {
    // Handle duplicate key error for patientId or token
    if (error.code === 11000 && error.keyPattern && (error.keyPattern.patientId || error.keyPattern.token)) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate patientId or token. Please try again.'
      });
    }
    console.error('Error adding patient to queue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

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
