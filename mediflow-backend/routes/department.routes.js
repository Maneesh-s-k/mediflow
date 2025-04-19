const express = require('express');
const router = express.Router();

// Get all departments
// GET /api/departments
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get all departments',
    data: [
      { name: 'Cardiology', capacity: 20, currentPatients: 15, waitTime: 45, staffCount: 5 },
      { name: 'General Medicine', capacity: 20, currentPatients: 12, waitTime: 30, staffCount: 4 },
      { name: 'Emergency', capacity: 20, currentPatients: 17, waitTime: 15, staffCount: 6 },
      { name: 'Pediatrics', capacity: 20, currentPatients: 9, waitTime: 20, staffCount: 3 },
      { name: 'Neurology', capacity: 20, currentPatients: 11, waitTime: 40, staffCount: 4 }
    ]
  });
});

// Get department by ID
// GET /api/departments/:id
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Get department with id ${req.params.id}`,
    data: { name: 'Cardiology', capacity: 20, currentPatients: 15, waitTime: 45, staffCount: 5 }
  });
});

// Create new department
// POST /api/departments
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create new department',
    data: req.body
  });
});

// Update department
// PUT /api/departments/:id
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Update department with id ${req.params.id}`,
    data: { id: req.params.id, ...req.body }
  });
});

// Delete department
// DELETE /api/departments/:id
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Delete department with id ${req.params.id}`
  });
});

// Get department load
// GET /api/departments/load
router.get('/load', (req, res) => {
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
    message: 'Get department load',
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
});

module.exports = router;
