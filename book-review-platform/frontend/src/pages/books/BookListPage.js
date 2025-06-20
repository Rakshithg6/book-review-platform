import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  Box, Button, Card, CardActions, CardContent, CardMedia, Chip, CircularProgress, Container,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
  FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper,
  Select, TablePagination, TextField, Tooltip, Typography, useMediaQuery, useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowDownward,
  ArrowUpward,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  FilterAltOff as FilterAltOffIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder,
  StarHalf,
} from '@mui/icons-material';

const BookListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // State management
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // For the input field
  const [searchQuery, setSearchQuery] = useState(''); // For the API query
  const [filters, setFilters] = useState({
    genre: '',
    rating: 0,
    minPages: '',
    maxPages: '',
    publishedAfter: '',
    publishedBefore: ''
  });
  const [sortOrder, setSortOrder] = useState({
    field: 'title',
    direction: 'asc'
  });
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    count: 0
  });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from backend API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        // Build query params
        const params = {
          search: searchQuery,
          genre: filters.genre,
          rating: filters.rating,
          minPages: filters.minPages,
          maxPages: filters.maxPages,
          publishedAfter: filters.publishedAfter,
          publishedBefore: filters.publishedBefore,
          page: pagination.page + 1, // Backend pages are usually 1-indexed
          limit: pagination.rowsPerPage
        };
        // Remove empty params
        Object.keys(params).forEach((key) => {
          if (params[key] === '' || params[key] === 0 || params[key] === undefined) {
            delete params[key];
          }
        });
        // Use axios for API call
        const response = await axios.get('http://localhost:5000/api/v1/books', { params });
        setBooks(response.data.data);
        setPagination(prev => ({ ...prev, count: response.data.total }));
      } catch (err) {
        setError('Failed to fetch books.');
        setBooks([]);
        setPagination(prev => ({ ...prev, count: 0 }));
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };
    fetchBooks();
    // eslint-disable-next-line
  }, [searchQuery, filters, sortOrder, pagination.page, pagination.rowsPerPage]);

  // Handler functions
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBook = () => {
    navigate('/dashboard/books/add');
  };

  const toggleFavorite = async (bookId) => {
    try {
      // TODO: Implement favorite toggle API call
      toast.success('Favorite status updated');
    } catch (err) {
      console.error('Error updating favorite status:', err);
      toast.error('Failed to update favorite status');
    }
  };

  // Render rating stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" />);
    }
    for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
      stars.push(<StarBorder key={`empty-${i}`} />);
    }
    return stars;
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setPagination(prev => ({ ...prev, rowsPerPage: parseInt(event.target.value, 10), page: 0 }));
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page on new search
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      genre: '',
      rating: 0,
      minPages: '',
      maxPages: '',
      publishedAfter: '',
      publishedBefore: ''
    });
    setSearchTerm('');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Books
        </Typography>
        {isAuthenticated && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBook}
          >
            Add Book
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search by title, author, or description"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Genre</InputLabel>
                <Select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  label="Genre"
                >
                  <MenuItem value="">All Genres</MenuItem>
                  <MenuItem value="Fiction">Fiction</MenuItem>
                  <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                  <MenuItem value="Fantasy">Fantasy</MenuItem>
                  <MenuItem value="Drama">Drama</MenuItem>
                  <MenuItem value="Romance">Romance</MenuItem>
                  <MenuItem value="Adventure">Adventure</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterAltOffIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Books Grid */}
      <Grid container spacing={3}>
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book) => (
            <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={book.coverImage}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {book.author}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    {renderRating(book.rating)}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({book.reviewCount})
                    </Typography>
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                    {Array.isArray(book.genres) && book.genres.map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/dashboard/books/${book._id}`)}
                  >
                    View Details
                  </Button>
                  <Box flexGrow={1} />
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(book._id)}
                    color="error"
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              No books found.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <TablePagination
          component="div"
          count={pagination.count}
          page={pagination.page}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </Container>
  );
};

export default BookListPage;
