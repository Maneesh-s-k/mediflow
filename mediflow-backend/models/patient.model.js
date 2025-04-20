const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  contact: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  urgencyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
    default: 1
  },
  symptoms: {
    type: String
  },
  vitals: {
    bloodPressure: String,
    temperature: Number,
    heartRate: Number,
    oxygenSaturation: Number,
    respiratoryRate: Number,
    bmi: Number
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  estimatedWaitTime: {
    type: Number,
    required: true
  },
  arrivalTime: {
    type: Date,
    default: Date.now
  },
  serviceStartTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Waiting', 'InService', 'Completed', 'Cancelled'],
    default: 'Waiting'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', PatientSchema);
