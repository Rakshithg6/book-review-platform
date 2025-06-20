import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Avatar,
  Rating,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Paper,
  Fade,
  CircularProgress,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  AutoStories as BookIcon, 
  Category as CategoryIcon, 
  RateReview as ReviewIcon, 
  People as PeopleIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowForward as ArrowForwardIcon,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email as EmailIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';

import api from '../utils/api';

const FEATURED_BOOKS_LIMIT = 6;

const categories = [
  { id: 1, name: 'Fiction', count: 1250 },
  { id: 2, name: 'Science Fiction', count: 980 },
  { id: 3, name: 'Mystery', count: 856 },
  { id: 4, name: 'Biography', count: 723 },
  { id: 5, name: 'Self-Help', count: 612 },
  { id: 6, name: 'Romance', count: 589 }
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Avid Reader',
    content: 'This platform helped me discover amazing books and connect with fellow book lovers. The reviews are genuine and helpful!',
    rating: 5,
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Book Blogger',
    content: 'As a book blogger, I find this platform incredibly useful for discovering new releases and getting honest reviews.',
    rating: 5,
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Librarian',
    content: 'I recommend this platform to all our library members. The community is fantastic and the content is top-notch!',
    rating: 4,
    avatar: 'EW'
  }
];

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      setFeaturedLoading(true);
      setFeaturedError(null);
      try {
        // Fetch all books or a featured endpoint, then slice top 6
        const { data } = await api.get('/books');
        setFeaturedBooks((data.data || []).slice(0, FEATURED_BOOKS_LIMIT));
      } catch (err) {
        setFeaturedError('Failed to load featured books.');
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchFeaturedBooks();
  }, []);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Handle subscription
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section with Full-viewport Background */}
      <Box sx={{ 
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        minHeight: 'calc(100vh - 70px)',
        marginTop: '-70px',
        paddingTop: '70px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&fit=crop&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 2,
        }
      }}>
        {/* Content Container */}
        
        <Box
          sx={{
            position: 'relative',
            zIndex: 10, // Increased z-index to ensure content is above the overlay
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0',
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, textAlign: 'center', width: '100%', px: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Fade in={!isLoading} timeout={1000}>
              <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
                <Chip 
                  label="BESTSELLING BOOKS" 
                  color="primary" 
                  size="small" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600, 
                    fontSize: '0.7rem',
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }} 
                />
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 3, 
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    lineHeight: 1.1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    color: 'white',
                    letterSpacing: '-0.5px',
                    '&:after': {
                      content: '""',
                      display: 'block',
                      width: '80px',
                      height: '4px',
                      backgroundColor: 'primary.main',
                      margin: '20px auto 0',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Discover Your Next Favorite Book
                </Typography>
                <Typography 
                  variant="h6" 
                  component="p" 
                  sx={{ 
                    mb: 4, 
                    maxWidth: '700px', 
                    mx: 'auto',
                    opacity: 0.9,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    lineHeight: 1.6,
                    textAlign: 'center',
                    px: { xs: 2, sm: 0 },
                    color: 'white'
                  }}
                >
                  Join thousands of readers in exploring, reviewing, and discussing the best books across all genres.
                  Find your next literary adventure with our curated collections and honest reviews.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'center', 
                  flexWrap: 'wrap',
                  mb: 6,
                  px: { xs: 2, sm: 0 }
                }}>
                  <Button 
                    component={RouterLink} 
                    to="/register" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
                      },
                      transition: 'all 0.3s ease',
                      minWidth: '150px'
                    }}
                  >
                    Get Started
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/login" 
                    variant="outlined" 
                    color="inherit" 
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      borderWidth: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      },
                      transition: 'all 0.3s ease',
                      borderColor: 'white',
                      color: 'white',
                      minWidth: '150px'
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
                
                <Box sx={{ 
                  mt: 8, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: { xs: 2, md: 4 }, 
                  flexWrap: 'wrap',
                  width: '100%',
                  maxWidth: '600px',
                  mx: 'auto',
                  px: { xs: 2, sm: 0 }
                }}>
                  {[
                    { value: '10,000+', label: 'Books' },
                    { value: '50,000+', label: 'Readers' },
                    { value: '100,000+', label: 'Reviews' },
                  ].map((stat, index) => (
                    <Box key={index} sx={{ 
                      textAlign: 'center', 
                      px: 2, 
                      py: 1, 
                      minWidth: 120,
                      flex: '1 1 0',
                      minWidth: '100px',
                      maxWidth: '180px'
                    }}>
                      <Typography 
                        variant="h4" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 0.5, 
                          color: 'primary.main',
                          textAlign: 'center'
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9, 
                          letterSpacing: 0.5, 
                          textTransform: 'uppercase', 
                          fontSize: '0.75rem',
                          textAlign: 'center',
                          color: 'white'
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Container>
        </Box>
      </Box>
      
      {/* Featured Books Section */}
      <Box sx={{ 
        py: 8, 
        backgroundColor: 'white',
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        zIndex: 10
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Featured Books
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Discover our handpicked selection of top-rated books across various genres
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {featuredLoading ? (
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress color="primary" />
                  </Box>
                </Grid>
              ) : featuredError ? (
                <Grid item xs={12}>
                  <Box display="flex" flexDirection="column" alignItems="center" minHeight="200px">
                    <Typography color="error" variant="h6" gutterBottom>{featuredError}</Typography>
                    <Button variant="outlined" color="primary" onClick={() => window.location.reload()}>Retry</Button>
                  </Box>
                </Grid>
              ) : (
                featuredBooks.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book._id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[8],
                        },
                      }}
                    >
                      <CardActionArea component={RouterLink} to={`/books/${book._id}`}>
                        <Box sx={{ height: 300, overflow: 'hidden' }}>
                          <Box 
                            sx={{ 
                              height: 380, 
                              width: '100%',
                              overflow: 'hidden',
                              position: 'relative',
                              bgcolor: 'background.paper',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 3,
                              '&:hover img': {
                                transform: 'scale(1.03)'
                              }
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={book.coverImage}
                              alt={book.title}
                              sx={{
                                transition: 'transform 0.4s ease',
                                objectFit: 'contain',
                                width: '100%',
                                height: '100%',
                                borderRadius: 1,
                                boxShadow: 3,
                                maxWidth: '85%',
                                maxHeight: '90%',
                                objectPosition: 'center',
                                backgroundColor: '#f8f9fa'
                              }}
                            />
                          </Box>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexGrow: 1 }}>
                            <Rating
                              value={book.rating && book.rating > 0 ? book.rating : 4.2}
                              precision={0.5}
                              readOnly
                              size="small"
                              icon={<StarIcon fontSize="inherit" color="primary" />}
                              emptyIcon={<StarBorderIcon fontSize="inherit" />}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {book.rating && book.rating > 0 ? book.rating : '4.2'} ({book.reviewCount || 42} reviews)
                            </Typography>
                          </Box>
                          <Typography gutterBottom variant="h6" component="h3" noWrap>
                            {book.title}
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            color="primary" 
                            sx={{ 
                              mt: 'auto',
                              textAlign: 'center',
                              width: '100%',
                              fontWeight: 500
                            }}
                          >
                            {book.author}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 2
                            }}
                          >
                            {book.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          color="primary" 
                          component={RouterLink}
                          to={`/books/${book._id}`}
                          endIcon={<ArrowForwardIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
          </Grid>
          
          <Box textAlign="center" mt={6}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/books"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              View All Books
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Box sx={{ 
        py: 8, 
        bgcolor: 'grey.50',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Browse by Category
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Explore books from various genres and find your next favorite read
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Card 
                  component={RouterLink}
                  to={`/books?category=${category.name.toLowerCase()}`}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      boxShadow: theme.shadows[4],
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                      '& .MuiTypography-root': {
                        color: 'white',
                      }
                    },
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h3" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.count} Books
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ 
        py: 8, 
        bgcolor: 'background.paper',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              What Our Readers Say
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              Join our community of book lovers and share your thoughts
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    p: 3,
                    position: 'relative',
                    '&:before': {
                      content: '"\u201C"',
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      fontSize: '5rem',
                      color: 'primary.light',
                      fontFamily: 'Georgia, serif',
                      lineHeight: 1,
                      opacity: 0.2,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontSize: '1.5rem',
                        mr: 2
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" component="div" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                      <Rating value={testimonial.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                    {testimonial.content}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter */}
      <Box sx={{ 
        py: 8, 
        bgcolor: 'primary.main', 
        color: 'white',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Stay Updated
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Subscribe to our newsletter for the latest book releases and reviews
            </Typography>
            
            <Box 
              component="form" 
              onSubmit={handleSubscribe}
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: '50px',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                size="large"
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3 }}>
              <IconButton aria-label="Facebook" sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}>
                <Facebook fontSize="large" />
              </IconButton>
              <IconButton aria-label="Twitter" sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}>
                <Twitter fontSize="large" />
              </IconButton>
              <IconButton aria-label="Instagram" sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}>
                <Instagram fontSize="large" />
              </IconButton>
              <IconButton aria-label="LinkedIn" sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}>
                <LinkedIn fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
