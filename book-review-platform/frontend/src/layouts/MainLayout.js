import React, { useEffect, useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  CircularProgress, 
  IconButton, 
  Collapse 
} from '@mui/material';
import { loadUser, logout } from '../redux/slices/authSlice';
import { Menu as MenuIcon, MenuBook as MenuBookOutlined } from '@mui/icons-material';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, error } = useSelector((state) => state.auth);

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && !isAuthenticated) {
      console.log('Token found in localStorage, attempting to load user...');
      dispatch(loadUser())
        .unwrap()
        .then((userData) => {
          console.log('User loaded successfully:', userData);
          // Redirect to the intended URL or dashboard
          const from = window.location.pathname !== '/login' ? window.location.pathname : '/dashboard';
          navigate(from, { replace: true });
        })
        .catch((error) => {
          console.error('Failed to load user:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            navigate('/login', { 
              state: { from: window.location.pathname },
              replace: true 
            });
          }
        });
    } else if (!token && !isAuthenticated) {
      console.log('No token found, redirecting to login');
      // Redirect to login if not already there and not on a public route
      const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (!publicRoutes.includes(window.location.pathname)) {
        navigate('/login', { 
          state: { from: window.location.pathname },
          replace: true 
        });
      }
    }
  }, [dispatch, isAuthenticated, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Only render the layout if user is authenticated
  if (!isAuthenticated) {
    return null; // or a redirect to login
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      {/* Header */}
      <AppBar 
        position="sticky"
        elevation={0}
        sx={{
          background: '#fff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          py: 0,
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar 
            disableGutters 
            sx={{ 
              minHeight: '70px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Logo */}
            <Box 
              component={RouterLink} 
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': {
                  '& .logo-text': {
                    color: 'primary.main',
                  },
                  '& .logo-icon': {
                    transform: 'scale(1.05)',
                  }
                },
                mr: { xs: 2, md: 4 }
              }}
            >
              <Box 
                className="logo-icon"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  mr: 1.5,
                  transition: 'all 0.2s ease',
                }}
              >
                <MenuBookOutlined sx={{ fontSize: 22 }} />
              </Box>
              <Typography
                variant="h6"
                noWrap
                className="logo-text"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  letterSpacing: '-0.3px'
                }}
              >
                BookReview
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1
            }}>
              <Button
                component={RouterLink}
                to="/books"
                sx={{
                  px: 2,
                  py: 1.5,
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  textTransform: 'none',
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: '2px',
                    bgcolor: 'primary.main',
                    transition: 'width 0.2s ease',
                  },
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:before': {
                      width: '70%',
                    }
                  },
                }}
              >
                Books
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/profile"
                    sx={{
                      px: 2,
                      py: 1.5,
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: '2px',
                        bgcolor: 'primary.main',
                        transition: 'width 0.2s ease',
                      },
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        '&:before': {
                          width: '70%',
                        }
                      },
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                      ml: 1,
                      px: 3,
                      py: 1.2,
                      fontWeight: 500,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{
                      px: 2,
                      py: 1.5,
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      borderRadius: '8px',
                      position: 'relative',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: '2px',
                        bgcolor: 'primary.main',
                        transition: 'width 0.2s ease',
                      },
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        '&:before': {
                          width: '70%',
                        }
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      ml: 1,
                      px: 3,
                      py: 1.2,
                      fontWeight: 500,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setMobileOpen(!mobileOpen)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Mobile menu */}
          <Collapse in={mobileOpen} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 2, pb: 3, display: { xs: 'block', md: 'none' } }}>

              
              {isAuthenticated ? (
                <>
                  <Button
                    fullWidth
                    component={RouterLink}
                    to="/profile"
                    sx={{
                      my: 1,
                      py: 1.5,
                      justifyContent: 'flex-start',
                      pl: 4,
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: 'primary.main',
                      },
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => dispatch({ type: 'auth/logout' })}
                    sx={{
                      my: 1,
                      py: 1.5,
                      justifyContent: 'flex-start',
                      pl: 4,
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    fullWidth
                    component={RouterLink}
                    to="/login"
                    sx={{
                      my: 1,
                      py: 1.5,
                      justifyContent: 'flex-start',
                      pl: 4,
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: 'primary.main',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    fullWidth
                    component={RouterLink}
                    to="/register"
                    sx={{
                      my: 1,
                      py: 1.5,
                      justifyContent: 'flex-start',
                      pl: 4,
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Collapse>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          bgcolor: 'background.paper',
          mt: 'auto',
          py: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Book Review Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;
