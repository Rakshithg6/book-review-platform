// Script to seed dummy books into MongoDB Atlas
require('dotenv').config();
const mongoose = require('mongoose');

const Book = require('./models/Book'); // Adjust path if needed

const DUMMY_BOOKS = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    isbn: '9780743273565',
    publishedDate: '1925-04-10',
    pageCount: 180,
    genres: ['Fiction', 'Drama'],
    description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    language: 'English',
    publisher: "Charles Scribner's Sons",
    averageRating: 4.5,
    ratingsQuantity: 128,
    price: 12.99,
    isFeatured: true,
    status: 'available',
    addedBy: '000000000000000000000000'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverImage: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    isbn: '9780061120084',
    publishedDate: '1960-07-11',
    pageCount: 281,
    genres: ['Fiction', 'Drama'],
    description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
    language: 'English',
    publisher: 'J.B. Lippincott & Co.',
    averageRating: 4.7,
    ratingsQuantity: 230,
    price: 10.99,
    isFeatured: true,
    status: 'available',
    addedBy: '000000000000000000000000'
  },
  {
    title: '1984',
    author: 'George Orwell',
    coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    isbn: '9780451524935',
    publishedDate: '1949-06-08',
    pageCount: 328,
    genres: ['Science Fiction', 'Drama'],
    description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
    language: 'English',
    publisher: 'Secker & Warburg',
    averageRating: 4.6,
    ratingsQuantity: 200,
    price: 9.99,
    isFeatured: false,
    status: 'available',
    addedBy: '000000000000000000000000'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverImage: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    isbn: '9780141439518',
    publishedDate: '1813-01-28',
    pageCount: 279,
    genres: ['Romance', 'Drama'],
    description: 'A romantic novel of manners that depicts the British Regency era.',
    language: 'English',
    publisher: 'T. Egerton',
    averageRating: 4.4,
    ratingsQuantity: 180,
    price: 8.99,
    isFeatured: false,
    status: 'available',
    addedBy: '000000000000000000000000'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    coverImage: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
    isbn: '9780547928227',
    publishedDate: '1937-09-21',
    pageCount: 310,
    genres: ['Fantasy', 'Adventure'],
    description: 'Bilbo Baggins joins a quest to reclaim the lost Dwarf Kingdom of Erebor.',
    language: 'English',
    publisher: 'George Allen & Unwin',
    averageRating: 4.8,
    ratingsQuantity: 350,
    price: 14.99,
    isFeatured: true,
    status: 'available',
    addedBy: '000000000000000000000000'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    coverImage: 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
    isbn: '9780316769488',
    publishedDate: '1951-07-16',
    pageCount: 214,
    genres: ['Fiction', 'Drama'],
    description: 'The story of Holden Caulfield, a teenager growing up in New York City.',
    language: 'English',
    publisher: 'Little, Brown and Company',
    averageRating: 4.2,
    ratingsQuantity: 140,
    price: 11.99,
    isFeatured: false,
    status: 'available',
    addedBy: '000000000000000000000000'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    coverImage: 'https://covers.openlibrary.org/b/id/8775117-L.jpg',
    isbn: '9780060850524',
    publishedDate: '1932-08-31',
    pageCount: 268,
    genres: ['Science Fiction', 'Drama'],
    description: 'A futuristic society controlled by technology and government.',
    language: 'English',
    publisher: 'Chatto & Windus',
    averageRating: 4.3,
    ratingsQuantity: 160,
    price: 12.49,
    isFeatured: false,
    status: 'available',
    addedBy: '000000000000000000000000'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    coverImage: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
    isbn: '9780061122415',
    publishedDate: '1988-04-15',
    pageCount: 208,
    genres: ['Adventure', 'Fantasy'],
    description: 'A novel about following your dreams and listening to your heart.',
    language: 'English',
    publisher: 'HarperTorch',
    averageRating: 4.1,
    ratingsQuantity: 120,
    price: 10.49,
    isFeatured: false,
    status: 'available',
    addedBy: '000000000000000000000000'
  }
];

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await Book.deleteMany({});
    await Book.insertMany(DUMMY_BOOKS);

    console.log('Dummy books inserted!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedBooks();
