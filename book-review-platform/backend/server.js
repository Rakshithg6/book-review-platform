require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Configure CORS to allow requests from your Vercel frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://book-review-platform-zeta.vercel.app',
  credentials: true
}));

app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // Prepare for Mongoose 7
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Event listeners for connection
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB.');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('Mongoose reconnected to DB.');
    });
    mongoose.connection.on('error', err => {
      console.error(`Mongoose connection error: ${err}`);
    });

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Server is shutting down.');
    process.exit(1);
  }
};

connectDB();

// Mount routers
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stats', statsRoutes);

// Test route
app.get('/api/v1/test', (req, res) => {
  res.status(200).json({ success: true, message: 'API is working!' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware - must be after all other middleware and routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
