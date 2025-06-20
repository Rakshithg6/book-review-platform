import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useTheme, useMediaQuery } from '@mui/material';

// Material-UI Components
import {
  Container, Box, Typography, Button, Grid, Paper, Avatar, Divider,
  CircularProgress, Chip, IconButton, Tabs, Tab, useMediaQuery as useMuiMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  Card, CardContent, CardMedia, Tooltip, Fab, Breadcrumbs, Link as MuiLink,
  Rating
} from '@mui/material';

// Icons
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  RateReview as RateReviewIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  Translate as TranslateIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';

// Components
import ScrollTop from '../../components/common/ScrollTop';
import TabPanel from '../../components/books/TabPanel';
import Review from '../../components/reviews/Review';
import ReviewForm from '../../components/reviews/ReviewForm';
import StarRating from '../../components/books/StarRating';
import api from '../../utils/api';
import { a11yProps, getTabStyles } from '../../utils/tabUtils';



const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMuiMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // State management
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInBookshelf, setIsInBookshelf] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [showSpoilers, setShowSpoilers] = useState({});

  // Fetch book and reviews data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/books/${id}`);
        setBook(data.data);
        // The backend sends approved reviews inside the book object
        setReviews(data.data.reviews || []);
        
        // Check if book is in user's favorites
        if (user && user.favorites) {
            setIsFavorite(user.favorites.includes(id));
        }

      } catch (error) {
        console.error('Error fetching book details:', error.response ? error.response.data : error.message);
        toast.error('Failed to load book details.');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchData();
    }
  }, [id, user, navigate]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      // TODO: Implement favorite toggle API call
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      toast.success(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Toggle bookshelf status
  const toggleBookshelf = async () => {
    try {
      // TODO: Implement bookshelf toggle API call
      const newBookshelfStatus = !isInBookshelf;
      setIsInBookshelf(newBookshelfStatus);
      toast.success(newBookshelfStatus ? 'Added to your bookshelf' : 'Removed from bookshelf');
    } catch (error) {
      console.error('Error updating bookshelf:', error);
      toast.error('Failed to update bookshelf');
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to submit a review.');
      return;
    }
    try {
      // Map ReviewForm fields to backend model
      const payload = {
        title: reviewData.title,
        content: reviewData.content,
        rating: reviewData.rating,
        containsSpoilers: reviewData.containsSpoilers,
        book: id
      };
      console.log('Submitting review payload:', payload);
      const { data } = await api.post(`/reviews`, payload);

      setReviews([data.data, ...reviews]);
      toast.success('Review submitted successfully! It will appear after approval.');
      setShowReviewForm(false);
      setEditingReview(null);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again to submit a review.');
        return;
      }
      console.error('Error submitting review:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.error || 'Failed to submit review.');
    }
  };

  // Handle review edit
  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  // Handle review delete
  const confirmDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    try {
      await api.delete(`/reviews/${reviewToDelete}`);
      setReviews(reviews.filter(r => r.id !== reviewToDelete));
      setDeleteDialogOpen(false);
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.error || 'Failed to delete review');
    }
  };

  // Toggle like on review
  const toggleLikeReview = (reviewId) => {
    if (!isAuthenticated) {
      toast.info('Please log in to like reviews');
      return;
    }

    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        const isLiked = review.likes.includes(user.id);
        return {
          ...review,
          likes: isLiked 
            ? review.likes.filter(id => id !== user.id)
            : [...review.likes, user.id]
        };
      }
      return review;
    }));
  };

  // Toggle review expansion
  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Toggle spoiler visibility
  const toggleSpoilers = (reviewId) => {
    setShowSpoilers(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Share functionality
  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
    handleShareClose();
  };

  const shareOnSocial = (platform) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${book?.title}" on BookReview!`);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
    };

    window.open(urls[platform], '_blank', 'noopener,noreferrer');
    handleShareClose();
  };

  if (loading || !book) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          Book not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const userReview = reviews.find(r => r.user?.id === user?.id);
  const averageRating = book.averageRating;
  const reviewsCount = reviews.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink 
          component={Link} 
          to="/" 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </MuiLink>
        <MuiLink 
          component={Link} 
          to="/books" 
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Books
        </MuiLink>
        <Typography color="text.primary">{book.title}</Typography>
      </Breadcrumbs>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {/* Book Header */}
      <Grid container spacing={4}>
        {/* Book Cover */}
        <Grid item xs={12} md={4} lg={3}>
          <Card elevation={3} sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="400"
              image={book.coverImage}
              alt={book.title}
              sx={{ objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <IconButton 
                  onClick={toggleFavorite}
                  color={isFavorite ? 'error' : 'default'}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title={isInBookshelf ? 'Remove from bookshelf' : 'Add to bookshelf'}>
                <IconButton 
                  onClick={toggleBookshelf}
                  color={isInBookshelf ? 'primary' : 'default'}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  {isInBookshelf ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton 
                  onClick={handleShareClick}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        </Grid>

        {/* Book Info */}
        <Grid item xs={12} md={8} lg={9}>
          <Box mb={3}>
            <Typography variant="h3" component="h1" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>
            
            <Box display="flex" alignItems="center" my={2}>
  <Rating
    value={Number.isFinite(averageRating) ? averageRating : 0}
    precision={0.5}
    readOnly
    size="large"
    icon={<StarIcon fontSize="inherit" color="primary" />}
    emptyIcon={<StarBorderIcon fontSize="inherit" />}
  />
  <Typography variant="body1" sx={{ ml: 1 }}>
    {Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'} · {reviewsCount || 0} {reviewsCount === 1 ? 'review' : 'reviews'}
  </Typography>
</Box>

            <Box mb={3}>
              <Chip 
                icon={<MenuBookIcon fontSize="small" />} 
                label={`${book.pageCount} pages`} 
                variant="outlined" 
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                icon={<TranslateIcon fontSize="small" />} 
                label={book.language} 
                variant="outlined" 
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
              {book.genres?.map(genre => (
                <Chip 
                  key={genre} 
                  label={genre} 
                  size="small" 
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Published: {format(new Date(book.publishedDate), 'MMMM d, yyyy')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Publisher: {book.publisher}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                ISBN: {book.isbn}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="book details tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label={`Reviews (${reviewsCount})`} {...a11yProps(1)} />
            <Tab label="About the Author" {...a11yProps(2)} />
            <Tab label="Details" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" paragraph>
            {book.description}
          </Typography>
          <Typography variant="body1" paragraph>
            {book.longDescription || 'No additional description available.'}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {isAuthenticated && (
            <Box mb={4}>
              {showReviewForm || !userReview ? (
                <ReviewForm
                  onSubmit={handleReviewSubmit}
                  onCancel={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                  }}
                  initialValues={editingReview || {}}
                />
              ) : (
                <Box textAlign="center" mb={4}>
                  <Typography variant="h6" gutterBottom>
                    Your Review
                  </Typography>
                  <Review 
                    review={userReview} 
                    isOwnReview={true}
                    onEdit={handleEditReview}
                    onDelete={confirmDeleteReview}
                    onLike={toggleLikeReview}
                    isLiked={userReview.likes?.includes(user?.id)}
                  />
                </Box>
              )}
            </Box>
          )}

          <Typography variant="h6" gutterBottom>
            {isAuthenticated ? 'Community Reviews' : 'Reviews'}
          </Typography>
          
          {reviews.length === 0 ? (
            <Typography color="text.secondary" align="center" py={4}>
              No reviews yet. Be the first to review!
            </Typography>
          ) : (
            <Box>
              {reviews
                .filter(r => !userReview || r.id !== userReview.id)
                .map(review => (
                  <Review
                    key={review.id}
                    review={review}
                    isOwnReview={review.user?.id === user?.id}
                    onEdit={handleEditReview}
                    onDelete={confirmDeleteReview}
                    onLike={toggleLikeReview}
                    isLiked={review.likes?.includes(user?.id)}
                  />
                ))}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            About {book.author}
          </Typography>
          <Typography variant="body1" paragraph>
            {book.authorBio || 'No author information available.'}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Title:</strong> {book.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Author:</strong> {book.author}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Publisher:</strong> {book.publisher}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Published:</strong> {format(new Date(book.publishedDate), 'MMMM d, yyyy')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>ISBN:</strong> {book.isbn}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Pages:</strong> {book.pageCount}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Language:</strong> {book.language}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Genres:</strong> {book.genres?.join(', ')}
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>

      {/* Share Menu */}
      <Dialog open={Boolean(shareAnchorEl)} onClose={handleShareClose}>
        <DialogTitle>Share this book</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" gap={2} p={2}>
            <IconButton 
              onClick={() => shareOnSocial('facebook')}
              color="primary"
              size="large"
            >
              <i className="fab fa-facebook" style={{ fontSize: 32 }}></i>
            </IconButton>
            <IconButton 
              onClick={() => shareOnSocial('twitter')}
              color="primary"
              size="large"
            >
              <i className="fab fa-twitter" style={{ fontSize: 32 }}></i>
            </IconButton>
            <IconButton 
              onClick={() => shareOnSocial('linkedin')}
              color="primary"
              size="large"
            >
              <i className="fab fa-linkedin" style={{ fontSize: 32 }}></i>
            </IconButton>
          </Box>
          <Box mt={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={copyToClipboard}
              startIcon={<i className="far fa-copy"></i>}
            >
              Copy Link
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteReview} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scroll to Top Button */}
      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <i className="fas fa-arrow-up"></i>
        </Fab>
      </ScrollTop>
    </Container>
  );
};

export default BookDetailsPage;
