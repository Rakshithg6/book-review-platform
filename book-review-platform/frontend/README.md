# Book Review Platform - Frontend

This is the frontend for the Book Review Platform, built with React, Redux, and Material-UI.

## Features

- User authentication (login/register)
- Browse and search books
- View book details and reviews
- Write and edit reviews
- User profiles
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API (see backend README for setup)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-review-platform.git
   cd book-review-platform/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from create-react-app (use with caution)

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Page components
  redux/          # Redux store, actions, and reducers
  services/       # API services
  utils/          # Utility functions
  App.js          # Main App component
  App.css         # Global styles
  index.js        # Entry point
```

## Technologies Used

- React
- Redux (with Redux Toolkit)
- React Router
- Material-UI
- Axios
- Formik & Yup (form handling and validation)
- React Testing Library

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
