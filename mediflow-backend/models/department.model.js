const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add department name'],
    unique: true,
    enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Emergency']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add department capacity'],
    default: 20
  },
  currentPatients: {
    type: Number,
    default: 0
  },
  waitTime: {
    type: Number,  // Average wait time in minutes
    default: 0
  },
  staffCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Normal', 'Medium', 'High'],
    default: 'Normal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate load percentage and update status
DepartmentSchema.pre('save', function(next) {
  const loadPercentage = Math.round((this.currentPatients / this.capacity) * 100);
  
  if (loadPercentage <= 50) {
    this.status = 'Normal';
  } else if (loadPercentage <= 75) {
    this.status = 'Medium';
  } else {
    this.status = 'High';
  }
  
  next();
});

module.exports = mongoose.model('Department', DepartmentSchema);
