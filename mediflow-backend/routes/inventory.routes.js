// routes/inventory.routes.js
const express = require('express');
const router = express.Router();

// Import both middleware functions
const { protect, authorize } = require('../middleware/auth');

// Import inventory controller functions
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
  updateItemStock
} = require('../controllers/inventory.controller');

// Get all inventory items
// GET /api/inventory
// Access: Private
router.get('/', protect, getAllItems);

// Get single inventory item
// GET /api/inventory/:id
// Access: Private
router.get('/:id', protect, getItemById);

// Create new inventory item
// POST /api/inventory
// Access: Private/Admin
router.post('/', protect, authorize('Admin', 'Pharmacist'), createItem);

// Update inventory item
// PUT /api/inventory/:id
// Access: Private/Admin
router.put('/:id', protect, authorize('Admin', 'Pharmacist'), updateItem);

// Delete inventory item
// DELETE /api/inventory/:id
// Access: Private/Admin
router.delete('/:id', protect, authorize('Admin', 'Pharmacist'), deleteItem);

// Get low stock items
// GET /api/inventory/status/low
// Access: Private
router.get('/status/low', protect, getLowStockItems);

// Update item stock (for quick stock adjustments)
// PATCH /api/inventory/:id/stock
// Access: Private
router.patch('/:id/stock', protect, authorize('Admin', 'Pharmacist', 'Nurse'), updateItemStock);

module.exports = router;
