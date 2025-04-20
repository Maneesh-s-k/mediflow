const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bed = require('../models/bed.model');

// GET /api/beds - Get all beds
router.get('/', async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json({
      success: true,
      data: beds
    });
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/beds/stats - Get bed statistics (MOVED BEFORE /:id)
router.get('/stats', async (req, res) => {
  try {
    const total = await Bed.countDocuments();
    const available = await Bed.countDocuments({ status: 'Available' });
    const occupied = await Bed.countDocuments({ status: 'Occupied' });
    const maintenance = await Bed.countDocuments({ status: 'Maintenance' });
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    res.json({
      success: true,
      data: {
        total,
        available,
        occupied,
        maintenance,
        occupancyRate
      }
    });
  } catch (error) {
    console.error('Error fetching bed statistics:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/beds/available - Get available beds (MOVED BEFORE /:id)
router.get('/available', async (req, res) => {
  try {
    const availableBeds = await Bed.find({ status: 'Available' });
    res.json({
      success: true,
      data: availableBeds
    });
  } catch (error) {
    console.error('Error fetching available beds:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/beds/:id - Get bed by ID (NOW AFTER SPECIFIC ROUTES)
router.get('/:id', async (req, res) => {
  try {
    // Check if ID is a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid bed ID format' });
    }
    
    const bed = await Bed.findById(req.params.id);
    if (!bed) {
      return res.status(404).json({ success: false, error: 'Bed not found' });
    }
    
    res.json({
      success: true,
      data: bed
    });
  } catch (error) {
    console.error('Error fetching bed:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PATCH /api/beds/:id/status - Update bed status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Available', 'Occupied', 'Maintenance', 'Reserved'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      {
        status,
        lastCleaned: status === 'Available' ? new Date() : undefined
      },
      { new: true }
    );
    
    if (!bed) {
      return res.status(404).json({ success: false, error: 'Bed not found' });
    }
    
    res.json({
      success: true,
      data: bed
    });
  } catch (error) {
    console.error('Error updating bed status:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
