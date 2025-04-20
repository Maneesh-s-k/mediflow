const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  bedId: {
    type: String,
    unique: true,
    required: true
  },
  location: {
    room: { type: String, required: true },
    floor: { type: String, required: true },
    ward: { type: String, required: true },
    description: String
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null
  },
  lastOccupied: Date,
  lastCleaned: Date
}, { timestamps: true });

module.exports = mongoose.model('Bed', BedSchema);
