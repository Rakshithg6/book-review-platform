const asyncHandler = require('../middleware/async');
const Book = require('../models/Book');
const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/v1/stats/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
    const totalBooks = await Book.countDocuments();
    const totalReviews = await Review.countDocuments({ status: 'approved' });
    
    // Define active user (e.g., logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: thirtyDaysAgo } });

    res.status(200).json({
        success: true,
        data: {
            totalBooks,
            totalReviews,
            activeUsers
        }
    });
});
