const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  // Reference to the original patient
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  // Basic patient info for quick reference
  patientName: {
    type: String,
    required: true
  },
  // Admission-specific fields
  admissionId: {
    type: String,
    unique: true
  },
  admissionDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dischargeDate: {
    type: Date
  },
  admissionType: {
    type: String,
    enum: ['Emergency', 'Planned', 'Transfer'],
    required: true
  },
  admissionReason: {
    type: String,
    required: true
  },
  // Bed assignment
  assignedBed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed'
  },
  // Medical details
  diagnosisCodes: [String],
  attendingPhysician: {
    type: String,
    required: true
  },
  notes: String,
  // Status tracking
  status: {
    type: String,
    enum: ['Active', 'Discharged', 'Transferred', 'Deceased'],
    default: 'Active'
  },
  // Insurance and billing
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    coverageDetails: String
  },
  estimatedStayDuration: {
    type: Number, // in days
    default: 1
  }
}, { timestamps: true });

// Generate a unique admission ID
AdmissionSchema.pre('save', async function(next) {
  if (this.admissionId) {
    return next();
  }
  
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Find the highest admission number for today
  const latestAdmission = await this.constructor.findOne({
    admissionId: new RegExp(`^ADM-${year}${month}${day}-`)
  }).sort({ admissionId: -1 });
  
  let sequence = 1;
  if (latestAdmission) {
    const parts = latestAdmission.admissionId.split('-');
    sequence = parseInt(parts[2]) + 1;
  }
  
  this.admissionId = `ADM-${year}${month}${day}-${String(sequence).padStart(3, '0')}`;
  next();
});

module.exports = mongoose.model('Admission', AdmissionSchema);
