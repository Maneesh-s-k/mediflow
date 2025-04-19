const Inventory = require('../models/inventory.model');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Inventory.find();
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private/Admin
exports.createItem = async (req, res, next) => {
  try {
    const { 
      name, 
      category, 
      stock, 
      minStock, 
      unit, 
      supplier, 
      price, 
      expiryDate, 
      location 
    } = req.body;

    // Create inventory item
    const item = await Inventory.create({
      name,
      category,
      stock,
      minStock,
      unit,
      supplier,
      price,
      expiryDate,
      location
    });

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    // Update item
    item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock items
// @route   GET /api/inventory/status/low
// @access  Private
exports.getLowStockItems = async (req, res, next) => {
  try {
    // Find items where stock is below minStock
    const items = await Inventory.find({
      $or: [
        { status: 'low' },
        { status: 'critical' },
        { status: 'out' }
      ]
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item stock (for quick stock adjustments)
// @route   PATCH /api/inventory/:id/stock
// @access  Private
exports.updateItemStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide stock value'
      });
    }

    let item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Inventory item not found'
      });
    }

    // Update stock
    item.stock = stock;
    
    // Update status based on stock level
    if (stock === 0) {
      item.status = 'out';
    } else if (stock < item.minStock * 0.5) {
      item.status = 'critical';
    } else if (stock < item.minStock) {
      item.status = 'low';
    } else {
      item.status = 'ok';
    }
    
    // Update lastUpdated timestamp
    item.lastUpdated = Date.now();
    
    await item.save();

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private
exports.getInventoryStats = async (req, res, next) => {
  try {
    // Count items by status
    const statusCounts = await Inventory.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Count items by category
    const categoryCounts = await Inventory.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate total inventory value
    const valueResult = await Inventory.aggregate([
      {
        $match: { price: { $exists: true } }
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    const totalValue = valueResult.length > 0 ? valueResult[0].totalValue : 0;

    // Format the status counts into an object
    const statusStats = {};
    statusCounts.forEach(item => {
      statusStats[item._id] = item.count;
    });

    // Format the category counts into an object
    const categoryStats = {};
    categoryCounts.forEach(item => {
      categoryStats[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        statusStats,
        categoryStats,
        totalValue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search inventory items
// @route   GET /api/inventory/search
// @access  Private
exports.searchInventory = async (req, res, next) => {
  try {
    const { query, category } = req.query;
    
    let searchQuery = {};
    
    // Add text search if query parameter exists
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { itemId: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Add category filter if category parameter exists
    if (category) {
      searchQuery.category = category;
    }
    
    const items = await Inventory.find(searchQuery);
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};
