const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a book title'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    slug: String,
    author: {
        type: String,
        required: [true, 'Please add an author name'],
        trim: true,
        maxlength: [100, 'Author name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    isbn: {
        type: String,
        required: [true, 'Please add an ISBN'],
        unique: true,
        trim: true,
        match: [/^(?:\d{9}[\dXx]|\d{13})$/, 'Please enter a valid ISBN (10 or 13 digits)']
    },
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    publishedDate: {
        type: Date,
        required: [true, 'Please add a publication date']
    },
    pageCount: {
        type: Number,
        min: [1, 'Page count must be at least 1']
    },
    genres: [{
        type: String,
        trim: true,
        enum: [
            'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 
            'Science Fiction', 'Fantasy', 'Romance', 'Horror',
            'Biography', 'History', 'Self-Help', 'Poetry', 'Drama',
            'Comedy', 'Adventure', 'Crime', 'Young Adult', 'Children',
            'Science', 'Technology', 'Business', 'Health', 'Cooking',
            'Travel', 'Art', 'Religion', 'Philosophy', 'Other'
        ]
    }],
    language: {
        type: String,
        default: 'English'
    },
    publisher: {
        type: String,
        trim: true,
        maxlength: [100, 'Publisher name cannot be more than 100 characters']
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        min: [0, 'Price must be a positive number']
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'out-of-stock', 'discontinued'],
        default: 'available'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create book slug from the title
bookSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

// Cascade delete reviews when a book is deleted
bookSchema.pre('remove', async function(next) {
    await this.model('Review').deleteMany({ book: this._id });
    next();
});

// Reverse populate with virtuals
bookSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'book',
    justOne: false
});

// Static method to get average rating
bookSchema.statics.getAverageRating = async function(bookId) {
    const obj = await this.model('Review').aggregate([
        {
            $match: { book: bookId }
        },
        {
            $group: {
                _id: '$book',
                averageRating: { $avg: '$rating' },
                numberOfReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        await this.model('Book').findByIdAndUpdate(bookId, {
            averageRating: obj[0] ? Math.ceil(obj[0].averageRating * 10) / 10 : 0,
            ratingsQuantity: obj[0] ? obj[0].numberOfReviews : 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save or delete review
bookSchema.post('save', function() {
    this.constructor.getAverageRating(this._id);
});

bookSchema.post('remove', function() {
    this.constructor.getAverageRating(this._id);
});

// Indexes for better query performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ publishedDate: -1 });

// Text index for search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);