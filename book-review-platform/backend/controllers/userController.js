const User = require('../models/User');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
        .select('-password -resetPasswordToken -resetPasswordExpire')
        .populate('favorites', 'title author coverImage slug');

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
    // Make sure user is the owner or admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to update this profile', 403));
    }

    const { currentPassword, newPassword, ...updateData } = req.body;

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Update password if provided
    if (currentPassword && newPassword) {
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return next(new ErrorResponse('Current password is incorrect', 401));
        }
        user.password = newPassword;
        await user.save();
    }

    // Update other fields
    const fieldsToUpdate = ['username', 'email', 'firstName', 'lastName', 'bio', 'avatar'];
    fieldsToUpdate.forEach(field => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });

    const updatedUser = await user.save();

    // Remove sensitive data before sending response
    updatedUser.password = undefined;
    updatedUser.resetPasswordToken = undefined;
    updatedUser.resetPasswordExpire = undefined;

    res.status(200).json({
        success: true,
        data: updatedUser
    });
});

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUserAccount = asyncHandler(async (req, res, next) => {
    // Make sure user is the owner or admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to delete this account', 403));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // If admin is deleting another user's account
    if (req.user.role === 'admin' && req.user.id !== req.params.id) {
        await user.remove();
        return res.status(200).json({
            success: true,
            data: {}
        });
    }

    // Regular user deleting their own account
    await user.remove();
    
    // Clear token cookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get user's reviews
// @route   GET /api/users/:id/reviews
// @access  Public
exports.getUserReviews = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Build query
    const query = { user: req.params.id };
    
    // Only show approved reviews to non-admins
    if (req.user?.role !== 'admin') {
        query.status = 'approved';
    }

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
        Review.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(limit)
            .populate('book', 'title author coverImage slug')
            .populate('likes', 'username profile')
            .lean(),
        Review.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        count: reviews.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: reviews
    });
});