const express = require('express');
const router = express.Router();

// Import auth middleware (uncomment when implemented)
// const { protect, authorize } = require('../middleware/auth');

// IMPORTANT: Specific routes must come before parameter routes
// Get patient queue status
// GET /api/patients/queue/status
router.get('/queue/status', /* protect, */ (req, res) => {
  try {
    // In a real implementation, you would fetch queue from database
    res.json({
      success: true,
      data: {
        count: 142,
        avgWaitTime: 24,
        byDepartment: [
          { department: 'Emergency', count: 45, avgWait: 15 },
          { department: 'General Medicine', count: 38, avgWait: 30 },
          { department: 'Cardiology', count: 25, avgWait: 25 },
          { department: 'Pediatrics', count: 18, avgWait: 20 },
          { department: 'Orthopedics', count: 16, avgWait: 35 }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching patient queue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add patient to queue
// POST /api/patients/queue
router.post('/queue', /* protect, */ (req, res) => {
  try {
    // Validate input
    const { name, department } = req.body;
    if (!name || !department) {
      return res.status(400).json({
        success: false,
        error: 'Please provide patient name and department'
      });
    }
    
    // In a real implementation, you would add the patient to the queue in the database
    res.status(201).json({
      success: true,
      message: 'Patient added to queue successfully',
      data: req.body
    });
  } catch (error) {
    console.error('Error adding patient to queue:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all patients
// GET /api/patients
router.get('/', /* protect, */ (req, res) => {
  try {
    // In a real implementation, you would fetch patients from database
    const patients = [
      {
        _id: 'pat001',
        patientId: 'PAT-2025-0001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        contact: '555-1234',
        email: 'john@example.com',
        address: '123 Main St',
        bloodGroup: 'O+',
        department: 'Cardiology',
        status: 'Admitted',
        admissionDate: '2025-04-15T10:30:00.000Z'
      },
      {
        _id: 'pat002',
        patientId: 'PAT-2025-0002',
        name: 'Jane Smith',
        age: 35,
        gender: 'Female',
        contact: '555-5678',
        email: 'jane@example.com',
        address: '456 Oak Ave',
        bloodGroup: 'A+',
        department: 'General Medicine',
        status: 'Waiting',
        admissionDate: null
      }
    ];
    
    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get patient by ID
// GET /api/patients/:id
router.get('/:id', /* protect, */ (req, res) => {
  try {
    // Validate ID
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid patient ID'
      });
    }
    
    // In a real implementation, you would fetch patient from database
    const patient = {
      _id: req.params.id,
      patientId: 'PAT-2025-0001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: '555-1234',
      email: 'john@example.com',
      address: '123 Main St',
      bloodGroup: 'O+',
      department: 'Cardiology',
      status: 'Admitted',
      admissionDate: '2025-04-15T10:30:00.000Z',
      medicalHistory: 'Hypertension, Diabetes Type 2',
      allergies: ['Penicillin', 'Peanuts'],
      emergencyContact: {
        name: 'Mary Doe',
        relation: 'Wife',
        phone: '555-4321'
      }
    };
    
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new patient
// POST /api/patients
router.post('/', /* protect, */ (req, res) => {
  try {
    // Validate required fields
    const { name, age, gender, contact, department } = req.body;
    if (!name || !age || !gender || !contact || !department) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, age, gender, contact and department'
      });
    }
    
    // Validate email format if provided
    const { email } = req.body;
    if (email && !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }
    
    // Validate age is a number
    if (isNaN(age) || age <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Age must be a positive number'
      });
    }
    
    // In a real implementation, you would save patient to database
    const { address, bloodGroup } = req.body;
    
    // Generate patient ID
    const patientId = `PAT-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newPatient = {
      _id: `pat${Math.floor(100 + Math.random() * 900)}`,
      patientId,
      name,
      age,
      gender,
      contact,
      email,
      address,
      bloodGroup,
      department,
      status: 'Waiting',
      admissionDate: null,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: newPatient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update patient
// PUT /api/patients/:id
router.put('/:id', /* protect, */ (req, res) => {
  try {
    // Validate ID
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid patient ID'
      });
    }
    
    // Validate email format if provided
    const { email } = req.body;
    if (email && !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }
    
    // Validate age is a number if provided
    const { age } = req.body;
    if (age && (isNaN(age) || age <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Age must be a positive number'
      });
    }
    
    // In a real implementation, you would update patient in database
    const updatedPatient = {
      _id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete patient
// DELETE /api/patients/:id
router.delete('/:id', /* protect, authorize('Admin'), */ (req, res) => {
  try {
    // Validate ID
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid patient ID'
      });
    }
    
    // In a real implementation, you would delete patient from database
    // You might also want to check if the patient exists before attempting to delete
    
    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
