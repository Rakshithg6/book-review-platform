const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @desc    Get dashboard stats
// @route   GET /api/v1/stats/dashboard
// @access  Private/Admin
router.get('/dashboard', authenticate, authorizeAdmin, getDashboardStats);

module.exports = router;
