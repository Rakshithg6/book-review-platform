const express = require('express');
const router = express.Router();
const { check, query } = require('express-validator');
const {
    getReviewsByBook,
    getReviewsByUser,
    createReview,
    updateReview,
    deleteReview,
    toggleLikeReview,
    getRecentReviews
} = require('../controllers/reviewController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @desc    Get recent reviews
// @route   GET /api/reviews/recent
// @access  Public
router.get('/recent', getRecentReviews);

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:bookId
// @access  Public
router.get(
    '/book/:bookId',
    [
        query('page', 'Page number must be a positive integer').optional().isInt({ min: 1 }),
        query('limit', 'Limit must be a positive integer').optional().isInt({ min: 1, max: 100 }),
        query('sortBy').optional().isIn(['-createdAt', 'createdAt', '-rating', 'rating', '-likes', 'likes']),
        query('status').optional().isIn(['pending', 'approved', 'rejected'])
    ],
    getReviewsByBook
);

// @desc    Get reviews by user
// @route   GET /api/reviews/user/:userId
// @access  Public
router.get(
    '/user/:userId',
    [
        query('page', 'Page number must be a positive integer').optional().isInt({ min: 1 }),
        query('limit', 'Limit must be a positive integer').optional().isInt({ min: 1, max: 100 }),
        query('sortBy').optional().isIn(['-createdAt', 'createdAt', '-rating', 'rating']),
        query('status').optional().isIn(['pending', 'approved', 'rejected'])
    ],
    getReviewsByUser
);

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post(
    '/',
    [
        authenticate,
        [
            check('book', 'Book ID is required').notEmpty(),
            check('book', 'Invalid book ID').isMongoId(),
            check('rating', 'Rating is required').notEmpty(),
            check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
            check('title', 'Title is required').notEmpty(),
            check('content', 'Content is required').notEmpty(),
            check('content', 'Content must be at least 10 characters').isLength({ min: 10 })
        ]
    ],
    createReview
);

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
router.put(
    '/:id',
    [
        authenticate,
        [
            check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
            check('content', 'Content must be at least 10 characters').optional().isLength({ min: 10 }),
            check('status').optional().isIn(['pending', 'approved', 'rejected'])
        ]
    ],
    updateReview
);

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete(
    '/:id',
    authenticate,
    deleteReview
);

// @desc    Like/Unlike a review
// @route   PUT /api/reviews/:id/like
// @access  Private
router.put(
    '/:id/like',
    authenticate,
    toggleLikeReview
);

module.exports = router;