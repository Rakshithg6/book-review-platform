import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Grid,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, clearError, resetAuthState } from '../../redux/slices/authSlice';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(!!location.state?.message);
  const [alertMessage, setAlertMessage] = useState(location.state?.message || '');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const formik = useFormik({
    initialValues: {
      email: location.state?.email || '',
      password: '',
    },
    validationSchema: validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        console.log('Login form submitted with values:', values);
        setShowAlert(false);
        dispatch(clearError());
        
        const result = await dispatch(login(values)).unwrap();
        console.log('Login successful, payload:', result);
        
        // Get the redirect path from location state or default to '/dashboard'
        const from = location.state?.from?.pathname || '/dashboard';
        console.log('Redirecting to:', from);
        
        // Use setTimeout to ensure state updates are processed before navigation
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 0);
        
      } catch (error) {
        console.error('Login failed:', error);
        const errorMessage = error || 'Invalid email or password';
        setAlertMessage(errorMessage);
        setAlertSeverity('error');
        setShowAlert(true);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    dispatch(resetAuthState());
    
    // Show message from location state if it exists
    if (location.state?.message) {
      setShowAlert(true);
      setAlertMessage(location.state.message);
      setAlertSeverity('info');
      // Clear the message from state to prevent showing it again on refresh
      window.history.replaceState({}, document.title);
    }
    
    // Clean up function to clear errors when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, location.state]);

  useEffect(() => {
    if (error) {
      setShowAlert(true);
      setAlertMessage(error);
      setAlertSeverity('error');
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to dashboard by default, or to the intended URL if it exists
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>
        
        {showAlert && (
          <Alert severity={alertSeverity} sx={{ mb: 3 }}>
            {alertMessage}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          <Box mb={2}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              variant="outlined"
              autoComplete="email"
              autoFocus
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>

          <Box mb={1}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || formik.isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading || formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/register" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
