const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/InventoryController');
const authenticateUser = require('../middlewares/authMiddleware');

// Route: POST /api/v1/inventory/inbound
router.post('/inbound', authenticateUser, InventoryController.handleInboundScan);

module.exports = router;