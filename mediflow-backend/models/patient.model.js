// models/patient.model.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
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
  department: {
    type: String,
    required: true
  },
  urgencyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  symptoms: {
    type: String
  },
  vitals: {
    bloodPressure: String,
    temperature: String,
    heartRate: String,
    oxygenSaturation: String
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  arrivalTime: {
    type: Date,
    default: Date.now
  },
  serviceStartTime: {
    type: Date
  },
  estimatedWaitTime: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Waiting', 'InService', 'Completed', 'Cancelled'],
    default: 'Waiting'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', PatientSchema);
