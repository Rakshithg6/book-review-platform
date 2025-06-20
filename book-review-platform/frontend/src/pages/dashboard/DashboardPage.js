import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Book as BookIcon, 
  Person as PersonIcon, 
  RateReview as ReviewIcon,
  MenuBook as MenuBookIcon,
  Add as AddIcon,
  RateReviewOutlined as RateReviewOutlinedIcon
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock data - replace with API calls in a real application
import axios from 'axios';

const mockBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImage: 'https://via.placeholder.com/150x200?text=Book+Cover',
    rating: 4.2,
    reviewCount: 128,
    genre: 'Classic',
    description: 'A story of decadence and excess in the Jazz Age.'
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverImage: 'https://via.placeholder.com/150x200?text=Book+Cover',
    rating: 4.5,
    reviewCount: 256,
    genre: 'Fiction',
    description: 'A powerful story of racial injustice and moral growth.'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    coverImage: 'https://via.placeholder.com/150x200?text=Book+Cover',
    rating: 4.7,
    reviewCount: 312,
    genre: 'Dystopian',
    description: 'A dystopian social science fiction novel and cautionary tale.'
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverImage: 'https://via.placeholder.com/150x200?text=Book+Cover',
    rating: 4.3,
    reviewCount: 289,
    genre: 'Romance',
    description: 'A romantic novel of manners that satirizes the British landed gentry.'
  }
];

const mockReviews = [
  {
    id: 1,
    user: 'Alice',
    bookTitle: 'The Great Gatsby',
    rating: 5,
    content: 'An absolute masterpiece of American literature!',
    date: '2023-10-25T10:00:00Z'
  },
  {
    id: 2,
    user: 'Bob',
    bookTitle: 'To Kill a Mockingbird',
    rating: 4,
    content: 'A timeless classic with important lessons.',
    date: '2023-10-24T14:30:00Z'
  },
  {
    id: 3,
    user: 'Charlie',
    bookTitle: '1984',
    rating: 5,
    content: 'More relevant today than ever. A must-read.',
    date: '2023-10-23T09:00:00Z'
  }
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [stats, setStats] = useState({ totalBooks: 0, totalReviews: 0, activeUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/v1/books/featured');
        setBooks(data.data);
      } catch (err) {
        setError('Failed to fetch featured books.');
        toast.error('Failed to fetch featured books.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();

    const fetchRecentReviews = async () => {
      try {
        setReviewsLoading(true);
        const { data } = await axios.get('/api/v1/reviews/recent');
        setRecentReviews(data.data);
      } catch (err) {
        setReviewsError('Failed to fetch recent reviews.');
        toast.error('Failed to fetch recent reviews.');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchRecentReviews();

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const { data } = await axios.get('/api/v1/stats/dashboard');
        setStats(data.data);
      } catch (err) {
        toast.error('Failed to fetch dashboard stats.');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      navigate(`/dashboard/books?search=${searchTerm}`);
    }
  };

  const handleBookClick = (id) => {
    navigate(`/dashboard/books/${id}`);
  };

  const filteredBooks = books.slice(0, 3); // Show first 3 featured books

  const statsData = [
    { title: 'Total Books', value: stats.totalBooks, icon: <MenuBookIcon fontSize="large" />, path: '/dashboard/books', loading: statsLoading },
    { title: 'Total Reviews', value: stats.totalReviews, icon: <RateReviewIcon fontSize="large" />, path: '/dashboard/reviews', loading: statsLoading },
    { title: 'Active Users', value: stats.activeUsers, icon: <PersonIcon fontSize="large" />, path: '/dashboard/users', loading: statsLoading },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Welcome Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {user?.name || 'Guest'}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's what's new in your literary world.
            </Typography>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for books, authors, or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 4 }}
          />

          {/* Stats */}
          <Paper sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Grid container spacing={3}>
              {statsData.map((stat) => (
                <Grid item xs={12} sm={4} key={stat.title}>
                  <RouterLink to={stat.path} style={{ textDecoration: 'none' }}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        color: stat.color,
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          bgcolor: 'action.selected'
                        }
                      }}
                    >
                      {stat.icon}
                      <Box>
                        <Typography variant="h5" component="p" fontWeight="bold">
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                      </Box>
                    </Paper>
                  </RouterLink>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Featured Books */}
          <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
            <Typography variant="h6" component="h3" mb={2}>
              Featured Books
            </Typography>
            {filteredBooks.length > 0 ? (
              <Grid container spacing={3}>
                {filteredBooks.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6
                        }
                      }}
                      onClick={() => handleBookClick(book.id)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={book.coverImage}
                        alt={book.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h4" noWrap>
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {book.author}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          <Rating value={book.rating} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" ml={1}>
                            ({book.reviewCount} reviews)
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No books found.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Recent Activity */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" component="h3" mb={2}>
              Recent Reviews
            </Typography>
            {recentReviews.length > 0 ? (
              <List disablePadding>
                {recentReviews.map((review, index) => (
                  <React.Fragment key={review.id}>
                    {index > 0 && <Divider variant="inset" component="li" />}
                    <ListItem alignItems="flex-start" disablePadding>
                      <ListItemAvatar>
                        <Avatar alt={review.user} src="/static/images/avatar/1.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="subtitle2" component="span" fontWeight="medium">
                              {review.user}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="span" ml={1}>
                              reviewed
                            </Typography>
                            <Typography variant="subtitle2" component="span" fontWeight="medium" ml={1}>
                              {review.bookTitle}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Box display="flex" alignItems="center" mt={0.5} mb={1}>
                              <Rating value={review.rating} size="small" readOnly />
                              <Typography variant="caption" color="text.secondary" ml={1}>
                                {new Date(review.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {review.content}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={2}>
                <Typography variant="body2" color="text.secondary">
                  No recent reviews found.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, borderRadius: 2, mt: 4 }}>
            <Typography variant="h6" component="h3" mb={2}>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button 
                component={RouterLink}
                to="/dashboard/books/add"
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<AddIcon />}
              >
                Add Book
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                startIcon={<MenuBookIcon />}
                onClick={() => navigate('/dashboard/books')}
              >
                Browse Books
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                startIcon={<RateReviewOutlinedIcon />}
                onClick={() => {
                  if (books.length > 0) {
                    navigate(`/dashboard/books/${books[0].id}/review`);
                  } else {
                    navigate('/dashboard/books');
                  }
                }}
              >
                Write a Review
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                startIcon={<PersonIcon />}
                onClick={() => navigate('/dashboard/profile')}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                View Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
