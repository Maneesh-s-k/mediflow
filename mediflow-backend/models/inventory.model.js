const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add item name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add category'],
    enum: ['Medication', 'Equipment', 'Supplies', 'Other']
  },
  stock: {
    type: Number,
    required: [true, 'Please add current stock'],
    min: 0
  },
  minStock: {
    type: Number,
    required: [true, 'Please add minimum stock level'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Please add unit of measurement']
  },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  price: {
    type: Number,
    min: 0
  },
  expiryDate: {
    type: Date
  },
  location: {
    type: String
  },
  status: {
    type: String,
    enum: ['ok', 'low', 'critical', 'out'],
    default: 'ok'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate inventory ID before saving
InventorySchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.itemId = `INV-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  // Update status based on stock level
  if (this.stock === 0) {
    this.status = 'out';
  } else if (this.stock < this.minStock * 0.5) {
    this.status = 'critical';
  } else if (this.stock < this.minStock) {
    this.status = 'low';
  } else {
    this.status = 'ok';
  }
  
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', InventorySchema);
