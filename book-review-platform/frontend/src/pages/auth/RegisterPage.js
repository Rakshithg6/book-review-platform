import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { register, clearError, resetAuthState } from '../../redux/slices/authSlice';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    )
    .required('Username is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(!!location.state?.message);
  const [alertMessage, setAlertMessage] = useState(location.state?.message || '');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Initialize form with email from location state if available
  const initialValues = {
    username: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Include role in the user data
      const { confirmPassword, agreeToTerms, ...userData } = values;
      const registrationData = {
        ...userData,
        role: 'user' // Default role for new users
      };
      
      console.log('Attempting registration with:', registrationData);
      const result = await dispatch(register(registrationData)).unwrap();
      console.log('Registration successful:', result);
      
      toast.success('Registration successful! Redirecting to dashboard...');
      
      // Get the redirect path from location state or default to '/dashboard'
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('Redirecting to:', from);
      
      // Use setTimeout to ensure state updates are processed before navigation
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 0);
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle specific error cases
      const errorMessage = error || 'Registration failed. Please try again.';
      
      if (errorMessage.includes('email')) {
        setFieldError('email', errorMessage);
      } else if (errorMessage.includes('username')) {
        setFieldError('username', errorMessage);
      } else if (errorMessage.includes('password')) {
        setFieldError('password', errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Clear any previous errors when component mounts
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

  // Show error alert when there's an error
  useEffect(() => {
    if (error) {
      setShowAlert(true);
      setAlertMessage(error);
      setAlertSeverity('error');
    }
  }, [error]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the intended URL or default to '/books'
      const from = location.state?.from?.pathname || '/books';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      setShowAlert(true);
      setAlertMessage(error);
      setAlertSeverity('error');
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper 
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Create an account
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Join our community of book lovers and start sharing your reviews.
        </Typography>
        
        {showAlert && (
          <Alert 
            severity={alertSeverity} 
            onClose={() => setShowAlert(false)}
            sx={{ width: '100%', mb: 3 }}
          >
            {alertMessage}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                margin="normal"
                variant="outlined"
                autoComplete="username"
                autoFocus
                disabled={loading}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
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
                disabled={loading}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
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
                helperText={
                  formik.touched.password 
                    ? formik.errors.password || 'At least 8 characters with uppercase, lowercase, number & symbol'
                    : ''
                }
                margin="normal"
                variant="outlined"
                autoComplete="new-password"
                disabled={loading}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                margin="normal"
                variant="outlined"
                autoComplete="new-password"
                disabled={loading}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    color="primary"
                    size="small"
                    disabled={loading}
                    sx={{
                      color: formik.touched.agreeToTerms && formik.errors.agreeToTerms 
                        ? 'error.main' 
                        : 'primary.main',
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{' '}
                    <Link href="/terms" color="primary" underline="hover" target="_blank" rel="noopener">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" color="primary" underline="hover" target="_blank" rel="noopener">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{
                  alignItems: 'flex-start',
                  mt: 1,
                  '& .MuiFormControlLabel-label': {
                    marginTop: '2px',
                  },
                }}
              />
              {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
                  {formik.errors.agreeToTerms}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!formik.isValid || loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink}
                    to="/login"
                    color="primary"
                    underline="hover"
                    sx={{ fontWeight: 500 }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
