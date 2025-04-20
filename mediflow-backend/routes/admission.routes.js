const express = require('express');
const router = express.Router();
const Admission = require('../models/admission.model');
const Patient = require('../models/patient.model');
const Bed = require('../models/bed.model');

// GET /api/admissions - Get all admissions
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().populate('assignedBed');
    res.json({
      success: true,
      data: admissions
    });
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admissions/active - Get active admissions
router.get('/active', async (req, res) => {
  try {
    const admissions = await Admission.find({ status: 'Active' }).populate('assignedBed');
    res.json({
      success: true,
      data: admissions
    });
  } catch (error) {
    console.error('Error fetching active admissions:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/admissions - Create new admission
router.post('/', async (req, res) => {
  try {
    const { patientId, admissionType, admissionReason, assignedBedId, attendingPhysician, diagnosisCodes, notes, estimatedStayDuration, insuranceDetails } = req.body;
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    // Check if bed exists and is available
    const bed = await Bed.findById(assignedBedId);
    if (!bed) {
      return res.status(404).json({ success: false, error: 'Bed not found' });
    }
    if (bed.status !== 'Available') {
      return res.status(400).json({ success: false, error: 'Bed is not available' });
    }
    
    // Create admission
    const admission = new Admission({
      patientId,
      patientName: patient.name,
      admissionType,
      admissionReason,
      assignedBed: assignedBedId,
      attendingPhysician,
      diagnosisCodes,
      notes,
      estimatedStayDuration,
      insuranceDetails
    });
    
    await admission.save();
    
    // Update bed status
    bed.status = 'Occupied';
    bed.patientId = patientId;
    bed.lastOccupied = new Date();
    await bed.save();
    
    res.status(201).json({
      success: true,
      data: admission
    });
  } catch (error) {
    console.error('Error creating admission:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admissions/:id - Get admission by ID
router.get('/:id', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id).populate('assignedBed');
    if (!admission) {
      return res.status(404).json({ success: false, error: 'Admission not found' });
    }
    res.json({
      success: true,
      data: admission
    });
  } catch (error) {
    console.error('Error fetching admission:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PATCH /api/admissions/:id/discharge - Discharge patient
router.patch('/:id/discharge', async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ success: false, error: 'Admission not found' });
    }
    
    if (admission.status !== 'Active') {
      return res.status(400).json({ success: false, error: 'Patient is not currently admitted' });
    }
    
    // Update admission
    admission.status = 'Discharged';
    admission.dischargeDate = new Date();
    admission.notes = admission.notes ? `${admission.notes}\n\nDischarge notes: ${req.body.notes || 'Patient discharged'}` : `Discharge notes: ${req.body.notes || 'Patient discharged'}`;
    await admission.save();
    
    // Free up the bed
    if (admission.assignedBed) {
      await Bed.findByIdAndUpdate(admission.assignedBed, {
        status: 'Available',
        patientId: null,
        lastCleaned: new Date()
      });
    }
    
    res.json({
      success: true,
      data: admission
    });
  } catch (error) {
    console.error('Error discharging patient:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/admissions/stats - Get admission statistics
router.get('/stats', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || 'week';
    let startDate = new Date();
    
    // Calculate start date based on timeframe
    if (timeframe === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (timeframe === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate.setDate(startDate.getDate() - 7); // Default to week
    }
    
    const total = await Admission.countDocuments();
    const active = await Admission.countDocuments({ status: 'Active' });
    const discharged = await Admission.countDocuments({ 
      status: 'Discharged',
      dischargeDate: { $gte: startDate }
    });
    
    // Calculate average stay duration for discharged patients
    const dischargedPatients = await Admission.find({
      status: 'Discharged',
      dischargeDate: { $gte: startDate }
    });
    
    let averageStayDuration = 0;
    if (dischargedPatients.length > 0) {
      const totalDuration = dischargedPatients.reduce((sum, admission) => {
        const admitDate = new Date(admission.admissionDate);
        const dischargeDate = new Date(admission.dischargeDate);
        const durationHours = (dischargeDate - admitDate) / (1000 * 60 * 60);
        return sum + durationHours;
      }, 0);
      
      averageStayDuration = Math.round(totalDuration / dischargedPatients.length / 24); // Convert to days
    }
    
    res.json({
      success: true,
      data: {
        timeframe,
        total,
        active,
        discharged,
        averageStayDuration
      }
    });
  } catch (error) {
    console.error('Error fetching admission statistics:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
