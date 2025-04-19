const express = require('express');
const router = express.Router();

// Register user
// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role, department } = req.body;
  
  // In a real implementation, you would validate input, check if user exists,
  // hash the password, and save to database
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token: 'sample-jwt-token',
    user: {
      id: 'user123',
      name,
      email,
      role,
      department
    }
  });
});

// Login user
// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // In a real implementation, you would validate credentials against database
  
  // For demo purposes, accept any login
  res.json({
    success: true,
    message: 'Login successful',
    token: 'sample-jwt-token',
    user: {
      id: 'user123',
      name: 'Dr. Sarah Chen',
      email: email,
      role: 'Doctor',
      department: 'Cardiology',
      avatar: 'SC'
    }
  });
});

// Get current user
// GET /api/auth/me
router.get('/me', (req, res) => {
  // In a real implementation, you would get user from JWT token
  
  res.json({
    success: true,
    data: {
      id: 'user123',
      name: 'Dr. Sarah Chen',
      email: 'doctor@mediflow.com',
      role: 'Doctor',
      department: 'Cardiology',
      avatar: 'SC'
    }
  });
});

// Update profile
// PUT /api/auth/profile
router.put('/profile', (req, res) => {
  const { name, department, specialty, contact } = req.body;
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: 'user123',
      name: name || 'Dr. Sarah Chen',
      email: 'doctor@mediflow.com',
      role: 'Doctor',
      department: department || 'Cardiology',
      specialty: specialty || 'Cardiology',
      contact: contact || '555-1234'
    }
  });
});

module.exports = router;
