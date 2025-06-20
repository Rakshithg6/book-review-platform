import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { loadUser } from '../../redux/slices/authSlice';

const ProtectedRoute = ({ children, adminOnly = false, roles = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'Please log in to access this page' 
          },
          replace: true 
        });
        setIsCheckingAuth(false);
        return;
      }

      // If we have a token but not authenticated, try to load the user
      if (token && !isAuthenticated) {
        try {
          console.log('Token found, attempting to load user...');
          await dispatch(loadUser()).unwrap();
          console.log('User loaded successfully');
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          navigate('/login', { 
            state: { 
              from: location.pathname,
              message: 'Your session has expired. Please log in again.' 
            },
            replace: true 
          });
        } finally {
          setIsCheckingAuth(false);
        }
      } else {
        setIsCheckingAuth(false);
      }
      
      setInitialCheckDone(true);
    };

    checkAuth();
  }, [dispatch, isAuthenticated, navigate, location.pathname]);

  // Check if user has required role
  useEffect(() => {
    if (initialCheckDone && isAuthenticated) {
      // Check admin only routes
      if (adminOnly && user?.role !== 'admin') {
        console.warn('Access denied: Admin role required');
        navigate('/', { 
          replace: true,
          state: { 
            message: 'You do not have permission to access this page' 
          }
        });
        return;
      }
      
      // Check custom role-based access
      if (roles.length > 0 && !roles.includes(user?.role)) {
        console.warn(`Access denied: Required roles: ${roles.join(', ')}`);
        navigate('/', { 
          replace: true,
          state: { 
            message: 'You do not have permission to access this page' 
          }
        });
      }
    }
  }, [initialCheckDone, isAuthenticated, adminOnly, roles, user, navigate]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth || loading || !initialCheckDone) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifying your session...
        </Typography>
      </Box>
    );
  }

  // Check if user has admin role for admin-only routes
  if (adminOnly && user?.role !== 'admin') {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        textAlign="center"
        p={3}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Go to Homepage
        </Button>
      </Box>
    );
  }

  // If authenticated and authorized, render the children or outlet
  return children || <Outlet />;
};

export default ProtectedRoute;
