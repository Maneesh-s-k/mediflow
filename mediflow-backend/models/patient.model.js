const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please add age']
  },
  gender: {
    type: String,
    required: [true, 'Please specify gender'],
    enum: ['Male', 'Female', 'Other']
  },
  contact: {
    type: String,
    required: [true, 'Please add contact number']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  medicalHistory: {
    type: String
  },
  allergies: [String],
  currentMedication: [String],
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  department: {
    type: String,
    enum: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Emergency'],
    required: true
  },
  status: {
    type: String,
    enum: ['Waiting', 'In Treatment', 'Admitted', 'Discharged'],
    default: 'Waiting'
  },
  admissionDate: {
    type: Date
  },
  dischargeDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate patient ID before saving
PatientSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const count = await this.constructor.countDocuments();
    this.patientId = `PAT-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Patient', PatientSchema);
