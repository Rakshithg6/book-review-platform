const Book = require('../models/Book');
const Review = require('../models/Review');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

// @desc    Get all books with pagination and search
// @route   GET /api/books
// @access  Public
exports.getBooks = asyncHandler(async (req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search and filter
    const searchQuery = req.query.search || '';
    const category = req.query.category || '';
    const minRating = parseFloat(req.query.minRating) || 0;
    let sortBy = req.query.sortBy || '-createdAt';
    if (req.query.sortField) {
        sortBy = req.query.sortDirection === 'desc' ? `-${req.query.sortField}` : req.query.sortField;
    }
    const author = req.query.author || '';

    let query = {};
    
    // Search filter
    if (searchQuery) {
        const regex = new RegExp(searchQuery, 'i'); // 'i' for case-insensitive
        query.$or = [
            { title: regex },
            { author: regex },
            { description: regex }
        ];
    }
    
    // Category filter
    if (category) {
        query.genres = category;
    }
    
    // Author filter
    if (author) {
        query.author = { $regex: author, $options: 'i' };
    }
    
    // Rating filter
    if (minRating > 0) {
        query.averageRating = { $gte: minRating };
    }

    // Genre filter
    if (req.query.genre && req.query.genre !== 'All Genres') {
        query.genres = req.query.genre;
    }

    // Get total count for pagination
    const total = await Book.countDocuments(query);
    
    // Get books with pagination and sorting
    const books = await Book.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate('addedBy', 'username profile')
        .lean();

    res.status(200).json({
        success: true,
        count: books.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: books
    });
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id)
        .populate('addedBy', 'username profile')
        .populate({
            path: 'reviews',
            populate: [
                {
                    path: 'user',
                    select: 'username profile'
                },
                {
                    path: 'likes',
                    select: 'username profile'
                }
            ],
            options: { 
                sort: { createdAt: -1 },
                match: { status: 'approved' }
            }
        });

    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
    }

    // Calculate average rating from approved reviews
    const approvedReviews = book.reviews.filter(review => review.status === 'approved');
    const totalRating = approvedReviews.reduce((acc, review) => acc + review.rating, 0);
    book.averageRating = approvedReviews.length > 0 
        ? Math.round((totalRating / approvedReviews.length) * 10) / 10 
        : 0;
    book.ratingsQuantity = approvedReviews.length;

    res.status(200).json({
        success: true,
        data: book
    });
});

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array(), 400));
    }

    const { 
        title, 
        author, 
        description, 
        genres, 
        publishedDate, 
        isbn,
        pageCount,
        publisher,
        language,
        coverImage,
        price,
        isFeatured,
        status
    } = req.body;
    
    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
        return next(new ErrorResponse(`A book with ISBN ${isbn} already exists`, 400));
    }

    // Create book
    const book = await Book.create({
        title,
        author,
        description,
        genres: Array.isArray(genres) ? genres : [genres],
        publishedDate: publishedDate || Date.now(),
        isbn,
        pageCount: pageCount || 0,
        publisher: publisher || '',
        language: language || 'English',
        coverImage: coverImage || 'no-cover.jpg',
        price: price || 0,
        isFeatured: isFeatured || false,
        status: status || 'available',
        addedBy: req.user.id
    });

    res.status(201).json({
        success: true,
        data: book
    });
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array(), 400));
    }

    const { 
        title, 
        author, 
        description, 
        genres, 
        publishedDate, 
        isbn,
        pageCount,
        publisher,
        language,
        coverImage,
        price,
        isFeatured,
        status
    } = req.body;

    // Find book
    let book = await Book.findById(req.params.id);
    
    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
    }

    // Check if ISBN is being updated and if it already exists
    if (isbn && isbn !== book.isbn) {
        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return next(new ErrorResponse(`A book with ISBN ${isbn} already exists`, 400));
        }
    }

    // Update fields
    const updateFields = {
        title: title || book.title,
        author: author || book.author,
        description: description || book.description,
        genres: genres ? (Array.isArray(genres) ? genres : [genres]) : book.genres,
        publishedDate: publishedDate || book.publishedDate,
        isbn: isbn || book.isbn,
        pageCount: pageCount !== undefined ? pageCount : book.pageCount,
        publisher: publisher !== undefined ? publisher : book.publisher,
        language: language || book.language,
        coverImage: coverImage || book.coverImage,
        price: price !== undefined ? price : book.price,
        isFeatured: isFeatured !== undefined ? isFeatured : book.isFeatured,
        status: status || book.status
    };

    // Update book
    book = await Book.findByIdAndUpdate(
        req.params.id, 
        { $set: updateFields },
        { new: true, runValidators: true }
    );
    
    res.status(200).json({
        success: true,
        data: book
    });
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
    }

    // Delete all reviews associated with this book
    await Review.deleteMany({ book: book._id });
    
    // Remove book from users' favorites
    await User.updateMany(
        { favorites: book._id },
        { $pull: { favorites: book._id } }
    );
    
    await book.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Toggle book favorite status for a user
// @route   PUT /api/books/:id/favorite
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
        return next(new ErrorResponse(`Book not found with id of ${req.params.id}`, 404));
    }

    const user = await User.findById(req.user.id);
    const isFavorite = user.favorites.includes(book._id);
    
    if (isFavorite) {
        // Remove from favorites
        user.favorites.pull(book._id);
        await user.save();
    } else {
        // Add to favorites
        user.favorites.push(book._id);
        await user.save();
    }
    
    res.status(200).json({
        success: true,
        data: { isFavorite: !isFavorite }
    });
});

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
exports.getFeaturedBooks = asyncHandler(async (req, res, next) => {
    const books = await Book.find({ isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('addedBy', 'username profile')
        .lean();

    res.status(200).json({
        success: true,
        count: books.length,
        data: books
    });
});

// @desc    Get all reviews for a book
// @route   GET /api/books/:id/reviews
// @access  Public
exports.getBookReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ 
        book: req.params.id,
        status: 'approved' 
    })
    .sort({ createdAt: -1 })
    .populate('user', 'username profile')
    .populate('likes', 'username profile');

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc    Get all unique genres
// @route   GET /api/books/genres/all
// @access  Public
exports.getGenres = asyncHandler(async (req, res, next) => {
    const genres = await Book.distinct('genres');
    
    res.status(200).json({
        success: true,
        count: genres.length,
        data: genres
    });
});

// @desc    Get all unique authors
// @route   GET /api/books/authors/all
// @access  Public
exports.getAuthors = asyncHandler(async (req, res, next) => {
    const authors = await Book.distinct('author');
    
    res.status(200).json({
        success: true,
        count: authors.length,
        data: authors
    });
});

// @desc    Get search suggestions
// @route   GET /api/books/search/suggestions
// @access  Public
exports.getSearchSuggestions = asyncHandler(async (req, res, next) => {
    const { q } = req.query;
    
    // Search in titles and authors
    const [titles, authors] = await Promise.all([
        Book.find(
            { title: { $regex: q, $options: 'i' } },
            'title slug'
        ).limit(5),
        Book.find(
            { author: { $regex: q, $options: 'i' } },
            'author',
            { collation: { locale: 'en', strength: 2 } }
        ).distinct('author').limit(5)
    ]);

    res.status(200).json({
        success: true,
        data: {
            titles: titles.map(book => ({
                id: book._id,
                title: book.title,
                slug: book.slug
            })),
            authors: authors
        }
    });
});
