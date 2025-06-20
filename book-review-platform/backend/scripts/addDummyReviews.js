// Script to add dummy reviews for each book in the database
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Review = require('../models/Review');
const User = require('../models/User');

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create/find 3 dummy users
  const dummyUsersData = [
    { username: 'alicej', name: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'Password123!' },
    { username: 'brianl', name: 'Brian Lee', email: 'brian.lee@example.com', password: 'Password123!' },
    { username: 'priyap', name: 'Priya Patel', email: 'priya.patel@example.com', password: 'Password123!' },
  ];
  const dummyUsers = [];
  for (const userData of dummyUsersData) {
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({ ...userData, lastLogin: new Date() });
    }
    dummyUsers.push(user);
  }

  // Get all books
  const books = await Book.find();
  if (!books.length) {
    console.log('No books found in the database.');
    return;
  }

  // Dummy review content
  const dummyReviews = [
    {
      title: 'Amazing Read',
      content: 'Absolutely loved this book! Highly recommended.',
      review: 'The narrative was captivating from start to finish. The author did an incredible job building the world and characters. I would definitely read it again!',
      rating: 5
    },
    {
      title: 'Great Story',
      content: 'Great read, interesting story and characters.',
      review: 'I enjoyed the twists and turns throughout the plot. The pacing was good and the characters felt real. Highly enjoyable!',
      rating: 4
    },
    {
      title: 'Good but Slow',
      content: 'Good book, but some parts were slow.',
      review: 'Some chapters dragged on, but overall it was a worthwhile read. The ending made up for the slow middle.',
      rating: 3
    },
  ];

  // Add 3 dummy reviews for each book, each from a different user
  for (const book of books) {
    for (let i = 0; i < dummyReviews.length; i++) {
      const review = dummyReviews[i];
      const user = dummyUsers[i];
      // Only create if not already exists
      const exists = await Review.findOne({ book: book._id, user: user._id });
      if (!exists) {
        await Review.create({
          book: book._id,
          user: user._id,
          title: review.title,
          content: review.content,
          review: review.review,
          rating: review.rating,
          status: 'approved',
          createdAt: new Date(),
        });
      }
    }
    console.log(`Added dummy reviews for book: ${book.title}`);
  }

  await mongoose.disconnect();
  console.log('Dummy reviews added for all books.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
