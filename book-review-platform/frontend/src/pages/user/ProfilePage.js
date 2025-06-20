import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Edit, Delete, Favorite, History, Settings, Logout } from '@mui/icons-material';
import { Rating } from '@mui/material';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  bio: Yup.string(),
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    joinDate: '',
    stats: {
      booksAdded: 0,
      reviewsWritten: 0,
      likesReceived: 0,
    },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch user profile data
    const fetchProfileData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // const response = await fetch(`/api/users/${user.id}`);
        // const data = await response.json();
        
        // Mock data
        setTimeout(() => {
          setProfileData({
            username: user?.username || 'JohnDoe',
            email: user?.email || 'john@example.com',
            bio: 'Book lover, reviewer, and avid reader. Love to explore different genres and share my thoughts on books I\'ve read.',
            joinDate: 'January 2023',
            stats: {
              booksAdded: 12,
              reviewsWritten: 24,
              likesReceived: 156,
            },
          });
          
          setRecentActivity([
            { id: 1, type: 'review', bookTitle: 'Sample Book 1', date: '2023-05-15', rating: 5 },
            { id: 2, type: 'favorite', bookTitle: 'Sample Book 2', date: '2023-05-10' },
            { id: 3, type: 'review', bookTitle: 'Sample Book 3', date: '2023-05-05', rating: 4 },
          ]);
          
          setFavoriteBooks([
            { id: 1, title: 'Favorite Book 1', author: 'Author 1', coverImage: 'https://via.placeholder.com/150' },
            { id: 2, title: 'Favorite Book 2', author: 'Author 2', coverImage: 'https://via.placeholder.com/150' },
            { id: 3, title: 'Favorite Book 3', author: 'Author 3', coverImage: 'https://via.placeholder.com/150' },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // In a real app, you would make an API call to delete the account
    console.log('Account deletion requested');
    setDeleteDialogOpen(false);
    handleLogout();
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // In a real app, you would make an API call to update the profile
      console.log('Profile updated:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with new values
      setProfileData(prev => ({
        ...prev,
        ...values
      }));
      
      // Show success message or notification
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
        {/* Profile Header */}
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 4,
            position: 'relative',
            height: 200,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-end',
              width: '100%',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                border: '4px solid white',
                bgcolor: 'secondary.main',
                fontSize: 48,
                mb: -60,
                ml: 4,
              }}
            >
              {profileData.username.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ ml: 18, mb: 2, color: 'white' }}>
              <Typography variant="h4" component="h1">
                {profileData.username}
              </Typography>
              <Typography variant="subtitle1">
                Member since {profileData.joinDate}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Profile Content */}
        <Box sx={{ p: 4, mt: 8 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 4 }}
          >
            <Tab label="Profile" icon={<Settings />} iconPosition="start" />
            <Tab label="Activity" icon={<History />} iconPosition="start" />
            <Tab label="Favorites" icon={<Favorite />} iconPosition="start" />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Edit Profile
              </Typography>
              
              <Formik
                initialValues={{
                  username: profileData.username,
                  email: profileData.email,
                  bio: profileData.bio,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Field name="username">
                          {({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Username"
                              margin="normal"
                              error={touched.username && Boolean(errors.username)}
                              helperText={touched.username && errors.username}
                            />
                          )}
                        </Field>
                        
                        <Field name="email">
                          {({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Email Address"
                              margin="normal"
                              type="email"
                              error={touched.email && Boolean(errors.email)}
                              helperText={touched.email && errors.email}
                            />
                          )}
                        </Field>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Field name="bio">
                          {({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Bio"
                              margin="normal"
                              multiline
                              rows={4}
                              placeholder="Tell us about yourself..."
                              error={touched.bio && Boolean(errors.bio)}
                              helperText={touched.bio && errors.bio}
                            />
                          )}
                        </Field>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" mt={3}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Edit />}
                          >
                            {isSubmitting ? 'Updating...' : 'Update Profile'}
                          </Button>
                          
                          <Box>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => setDeleteDialogOpen(true)}
                              startIcon={<Delete />}
                              sx={{ mr: 2 }}
                            >
                              Delete Account
                            </Button>
                            
                            <Button
                              variant="outlined"
                              onClick={handleLogout}
                              startIcon={<Logout />}
                            >
                              Logout
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
              
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {profileData.stats.booksAdded}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Books Added
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {profileData.stats.reviewsWritten}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Reviews Written
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {profileData.stats.likesReceived}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Likes Received
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Recent Activity
              </Typography>
              
              {recentActivity.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent activity to show.
                </Typography>
              ) : (
                <Box>
                  {recentActivity.map((activity) => (
                    <Box 
                      key={activity.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {activity.type === 'review' ? (
                        <>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            <Edit />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              You reviewed <strong>{activity.bookTitle}</strong>
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <Rating value={activity.rating} size="small" readOnly />
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {activity.date}
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                            <Favorite />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              You added <strong>{activity.bookTitle}</strong> to favorites
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.date}
                            </Typography>
                          </Box>
                        </>
                      )}
                      <Box flexGrow={1} />
                      <Button size="small">View</Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
          
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Favorite Books
              </Typography>
              
              {favoriteBooks.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No favorite books yet. Start adding some!
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {favoriteBooks.map((book) => (
                    <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="200"
                            image={book.coverImage}
                            alt={book.title}
                            sx={{ objectFit: 'cover' }}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h6" component="h3" noWrap>
                              {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {book.author}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton size="small" color="error">
                            <Favorite />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
