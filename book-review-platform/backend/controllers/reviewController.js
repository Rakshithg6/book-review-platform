const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
exports.getReviewsByBook = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { sortBy = '-createdAt', status = 'approved' } = req.query;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return next(new ErrorResponse('Invalid status value', 400));
    }

    // Check if book exists
    const book = await Book.findById(req.params.bookId);
    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.bookId}`, 404));
    }

    // Build query
    const query = { book: req.params.bookId };
    
    // Only apply status filter for non-admin users
    if (req.user?.role !== 'admin') {
        query.status = 'approved';
    } else if (status) {
        query.status = status;
    }

    // Get reviews with pagination and sorting
    const [reviews, total] = await Promise.all([
        Review.find(query)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profile')
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

// @desc    Get reviews by user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getReviewsByUser = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { sortBy = '-createdAt', status } = req.query;

    // Check if user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.userId}`, 404));
    }

    // Build query
    const query = { user: req.params.userId };
    
    // Apply status filter if provided and user is admin or the review owner
    if (status) {
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return next(new ErrorResponse('Invalid status value', 400));
        }
        
        // Only allow non-approved status filtering for admins or the review owner
        if (status !== 'approved' && 
            req.user?.role !== 'admin' && 
            req.user?.id !== req.params.userId) {
            return next(new ErrorResponse('Not authorized to view these reviews', 403));
        }
        
        query.status = status;
    } else if (req.user?.role !== 'admin' && req.user?.id !== req.params.userId) {
        // For non-admin users viewing other users' reviews, only show approved
        query.status = 'approved';
    }

    // Get reviews with pagination and sorting
    const [reviews, total] = await Promise.all([
        Review.find(query)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profile')
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

// @desc    Get recent reviews
// @route   GET /api/reviews/recent
// @access  Public
exports.getRecentReviews = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 5;

    const reviews = await Review.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .limit(limit)
        
        .populate('book', 'title slug')
        .lean();

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
    console.log('Review POST body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array(), 400));
    }

    const { book: bookId, rating, title, content, containsSpoilers } = req.body;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${bookId}`, 404));
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ 
        user: req.user.id, 
        book: bookId 
    });

    if (existingReview) {
        return next(new ErrorResponse('You have already reviewed this book', 400));
    }

    // Create review
    const review = new Review({
        user: req.user.id,
        book: bookId,
        title,
        content,
        rating,
        containsSpoilers,
        status: req.user.role === 'admin' ? 'approved' : 'pending' // Auto-approve admin reviews
    });

    await review.save();

    // Update book's rating stats if review is approved
    if (review.status === 'approved') {
        await updateBookRating(bookId);
    }

    // Populate user and book details
    await review.populate([
        { path: 'user', select: 'username profile' },
        { path: 'book', select: 'title author slug' },
        { path: 'likes', select: 'username profile' }
    ]);

    res.status(201).json({ 
        success: true, 
        data: review 
    });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array(), 400));
    }

    const { rating, comment, status } = req.body;
    
    let review = await Review.findById(req.params.id)
        
        .populate('book', 'title author slug');
    
    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    // Check if user is the review owner or admin
    if (review.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to update this review', 403));
    }

    // Only allow admins to update review status
    if (status && status !== review.status && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to change review status', 403));
    }

    // Store old status for book rating update check
    const oldStatus = review.status;
    
    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (status) review.status = status;
    
    review.edited = true;
    review.lastEditedAt = Date.now();
    
    await review.save();

    // Update book's rating if status changed to/from approved or rating was updated
    if ((oldStatus === 'approved' || review.status === 'approved') || rating !== undefined) {
        await updateBookRating(review.book);
    }
    
    // Populate likes for the response
    await review.populate('likes', 'username profile');
    
    res.status(200).json({ 
        success: true, 
        data: review 
    });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    // Check if user is the review owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to delete this review', 403));
    }

    const bookId = review.book;
    const wasApproved = review.status === 'approved';
    
    // Remove the review
    await review.remove();

    // Update book's rating if the review was approved
    if (wasApproved) {
        await updateBookRating(bookId);
    }

    res.status(200).json({ 
        success: true, 
        data: {} 
    });
});

// @desc    Like/Unlike a review
// @route   PUT /api/reviews/:id/like
// @access  Private
exports.toggleLikeReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
        
        .populate('likes', 'username profile');

    if (!review) {
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404));
    }

    // Check if user is trying to like their own review
    if (review.user._id.toString() === req.user.id) {
        return next(new ErrorResponse('You cannot like your own review', 400));
    }

    // Check if review is approved
    if (review.status !== 'approved') {
        return next(new ErrorResponse('Cannot like a review that is not approved', 400));
    }

    // Check if the user has already liked the review
    const likeIndex = review.likes.findIndex(like => 
        like._id.toString() === req.user.id
    );
    
    let action;
    if (likeIndex === -1) {
        // Add like
        review.likes.push(req.user.id);
        action = 'liked';
    } else {
        // Remove like
        review.likes.splice(likeIndex, 1);
        action = 'unliked';
    }

    await review.save();
    
    // Populate the updated likes array
    await review.populate('likes', 'username profile');

    res.status(200).json({ 
        success: true, 
        data: {
            action,
            likesCount: review.likes.length,
            review: {
                id: review._id,
                likes: review.likes
            }
        }
    });
});

// @desc    Helper function to update a book's average rating and ratings count
// @param   {String} bookId - The ID of the book to update
// @return  {Promise<void>}
async function updateBookRating(bookId) {
    try {
        // Validate bookId
        if (!bookId || !require('mongoose').Types.ObjectId.isValid(bookId)) {
            console.error('Invalid bookId provided to updateBookRating');
            return;
        }

        // Get all approved reviews for the book
        const result = await Review.aggregate([
            {
                $match: { 
                    book: new require('mongoose').Types.ObjectId(bookId),
                    status: 'approved' 
                }
            },
            {
                $group: {
                    _id: '$book',
                    averageRating: { $avg: '$rating' },
                    ratingsCount: { $sum: 1 },
                    ratingsDistribution: {
                        $push: {
                            rating: '$rating',
                            count: 1
                        }
                    }
                }
            },
            {
                $project: {
                    averageRating: { $round: ['$averageRating', 1] },
                    ratingsCount: 1,
                    ratingsDistribution: {
                        $reduce: {
                            input: [1, 2, 3, 4, 5],
                            initialValue: [],
                            in: {
                                $concatArrays: [
                                    '$$value',
                                    [
                                        {
                                            rating: '$$this',
                                            count: {
                                                $size: {
                                                    $filter: {
                                                        input: '$ratingsDistribution',
                                                        as: 'r',
                                                        cond: { $eq: ['$$r.rating', '$$this'] }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                ]
                            }
                        }
                    }
                }
            }
        ]);


        // Update the book with the new rating data
        if (result.length > 0) {
            const { averageRating, ratingsCount, ratingsDistribution } = result[0];
            
            await Book.findByIdAndUpdate(
                bookId,
                {
                    averageRating,
                    ratingsCount,
                    ratingsDistribution: ratingsDistribution.sort((a, b) => b.rating - a.rating)
                },
                { new: true, runValidators: true }
            );
        } else {
            // If no approved reviews, reset to default values
            await Book.findByIdAndUpdate(
                bookId,
                {
                    averageRating: 0,
                    ratingsCount: 0,
                    ratingsDistribution: [
                        { rating: 5, count: 0 },
                        { rating: 4, count: 0 },
                        { rating: 3, count: 0 },
                        { rating: 2, count: 0 },
                        { rating: 1, count: 0 }
                    ]
                },
                { new: true, runValidators: true }
            );
        }
    } catch (error) {
        console.error('Error updating book rating:', error.message);
        // Re-throw the error to be caught by the calling function
        throw error;
    }
}
