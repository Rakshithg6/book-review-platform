import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { loadUser } from './redux/slices/authSlice';

// Theme
import theme from './theme';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import BookListPage from './pages/books/BookListPage';
import BookDetailsPage from './pages/books/BookDetailsPage';
import AddBookPage from './pages/books/AddBookPage';
import UserProfilePage from './pages/dashboard/UserProfilePage';
import AccountSettingsPage from './pages/dashboard/AccountSettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Load user on initial app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && !loading) {
      console.log('App mounted, loading user...');
      dispatch(loadUser())
        .unwrap()
        .then(() => {
          console.log('User loaded successfully from App component');
        })
        .catch((error) => {
          console.error('Failed to load user:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
  }, [dispatch, isAuthenticated, loading]);

  // Show toast messages from route state
  useEffect(() => {
    if (location.state?.message) {
      toast.info(location.state.message);
      // Clear the message from state to prevent showing it again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/" element={<HomePage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
        
        {/* Auth Routes - Auth Layout */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
        
        {/* Protected Dashboard Routes - Dashboard Layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BookListPage />} />
          <Route path="books/add" element={<AddBookPage />} />
          <Route path="books" element={<BookListPage />} />
          <Route path="books/:id" element={<BookDetailsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="profile/settings" element={<AccountSettingsPage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
