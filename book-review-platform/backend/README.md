# Book Review Platform - Backend API

This is the backend API for the Book Review Platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, JWT)
- Book management (CRUD operations)
- Review system with ratings and comments
- User profiles and activity tracking
- Search and filtering of books
- Pagination for large datasets

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-review-platform.git
   cd book-review-platform/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/book-review-platform
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile

### Books

- `GET /api/books` - Get all books (with pagination and search)
- `GET /api/books/:id` - Get single book by ID
- `POST /api/books` - Create a new book (Admin only)
- `PUT /api/books/:id` - Update a book (Admin only)
- `DELETE /api/books/:id` - Delete a book (Admin only)

### Reviews

- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `GET /api/reviews/user/:userId` - Get reviews by user
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review
- `PUT /api/reviews/:id/like` - Like/Unlike a review

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account
- `GET /api/users/:id/reviews` - Get user's reviews

## Development

### Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (coming soon)
- `npm run lint` - Lint code with ESLint

### Environment Variables

- `PORT` - Port to run the server on (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Application environment (development/production)

## Deployment

1. Set up a MongoDB database (MongoDB Atlas recommended for production)
2. Configure environment variables in your hosting platform
3. Build the application: `npm run build`
4. Start the server: `npm start`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
