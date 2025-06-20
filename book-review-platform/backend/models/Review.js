const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the review'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add your review content'],
        maxlength: [5000, 'Review cannot be more than 5000 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isRecommended: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: {
        type: String,
        maxlength: [500, 'Rejection reason cannot be more than 500 characters']
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    lastEditedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent user from submitting more than one review per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Static method to get average rating of a book
reviewSchema.statics.getAverageRating = async function(bookId) {
    const obj = await this.aggregate([
        {
            $match: { book: bookId, status: 'approved' }
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

// Call getAverageRating after save
reviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.book);
});

// Call getAverageRating after remove
reviewSchema.post('remove', function() {
    this.constructor.getAverageRating(this.book);
});

// Add text index for searching reviews
reviewSchema.index({ title: 'text', content: 'text' });

// Virtual for review's likes count
reviewSchema.virtual('likesCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Check if review is liked by a specific user
reviewSchema.methods.isLikedByUser = function(userId) {
    return this.likes.some(like => like._id.toString() === userId.toString());
};

// Check if review can be edited (within 24 hours of creation)
reviewSchema.methods.canBeEdited = function() {
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return new Date() - this.createdAt < oneDay;
};

module.exports = mongoose.model('Review', reviewSchema);