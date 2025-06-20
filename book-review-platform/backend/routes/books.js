const express = require('express');
const router = express.Router();
const { check, query } = require('express-validator');
const bookController = require('../controllers/bookController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Validation middleware
const validateBookInput = [
    check('title', 'Title is required').trim().notEmpty(),
    check('author', 'Author is required').trim().notEmpty(),
    check('description', 'Description is required').trim().notEmpty(),
    check('genres', 'At least one genre is required').isArray({ min: 1 }),
    check('genres.*', 'Genre must be a string').isString(),
    check('isbn', 'ISBN is required').trim().notEmpty(),
    check('pageCount', 'Page count must be a positive integer').optional().isInt({ min: 0 }),
    check('publishedDate', 'Published date is required').isISO8601(),
    check('language', 'Language is required').trim().notEmpty(),
    check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
    check('isFeatured', 'isFeatured must be a boolean').optional().isBoolean(),
    check('status', 'Invalid status').optional().isIn(['available', 'unavailable', 'coming-soon'])
];

// @route   GET /api/books
// @desc    Get all books with pagination, search, and filters
// @access  Public
router.get(
    '/',
    [
        query('page', 'Page number must be a positive integer').optional().isInt({ min: 1 }),
        query('limit', 'Limit must be a positive integer').optional().isInt({ min: 1, max: 100 }),
        query('search', 'Search query must be a string').optional().trim(),
        query('category', 'Category must be a string').optional().trim(),
        query('minRating', 'Minimum rating must be a number between 0 and 5').optional().isFloat({ min: 0, max: 5 }),
        query('sortBy', 'Invalid sort field').optional().isIn(['title', 'author', 'publishedDate', 'averageRating', '-title', '-author', '-publishedDate', '-averageRating']),
        query('author', 'Author must be a string').optional().trim()
    ],
    bookController.getBooks
);

// @route   GET /api/books/featured
// @desc    Get featured books
// @access  Public
router.get(
    '/featured',
    bookController.getFeaturedBooks
);

// @route   GET /api/books/:id
// @desc    Get single book by ID or slug
// @access  Public
router.get(
    '/:id',
    [
        check('id', 'Book ID is required').notEmpty()
    ],
    bookController.getBook
);

// @route   POST /api/books
// @desc    Create a new book
// @access  Private/Admin
router.post(
    '/',
    [
        authenticate,
        ...validateBookInput
    ],
    bookController.createBook
);

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private/Admin
router.put(
    '/:id',
    [
        authenticate,
        authorizeAdmin,
        check('id', 'Book ID is required').isMongoId(),
        ...validateBookInput.map(validation => validation.optional())
    ],
    bookController.updateBook
);

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private/Admin
router.delete(
    '/:id',
    [
        authenticate,
        authorizeAdmin,
        check('id', 'Book ID is required').isMongoId()
    ],
    bookController.deleteBook
);

// @route   PUT /api/books/:id/favorite
// @desc    Toggle favorite status for a book
// @access  Private
router.put(
    '/:id/favorite',
    [
        authenticate,
        check('id', 'Book ID is required').isMongoId()
    ],
    bookController.toggleFavorite
);

// @route   GET /api/books/:id/reviews
// @desc    Get all reviews for a book
// @access  Public
router.get(
    '/:id/reviews',
    [
        check('id', 'Book ID is required').isMongoId()
    ],
    bookController.getBookReviews
);

// @route   GET /api/books/genres/all
// @desc    Get all unique genres
// @access  Public
router.get(
    '/genres/all',
    bookController.getGenres
);

// @route   GET /api/books/authors/all
// @desc    Get all unique authors
// @access  Public
router.get(
    '/authors/all',
    bookController.getAuthors
);

// @route   GET /api/books/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get(
    '/search/suggestions',
    [
        query('q', 'Search query is required').trim().notEmpty()
    ],
    bookController.getSearchSuggestions
);

module.exports = router;
