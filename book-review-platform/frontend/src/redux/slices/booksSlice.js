import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1/books';

// Initial state
const initialState = {
  books: [],
  loading: false,
  error: null,
  currentBook: null,
  searchQuery: '',
  filters: {
    genre: '',
    rating: 0,
  },
  sortBy: 'title',
  sortOrder: 'asc',
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
};

// Helper function to build query parameters
const buildQueryParams = (state) => {
  const { pagination, sortBy, sortOrder, filters, searchQuery } = state;
  const params = new URLSearchParams();
  
  // Always include pagination and sorting
  params.append('page', pagination.page);
  params.append('limit', pagination.limit);
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);
  
  // Add filters if present
  if (filters.genre) params.append('genre', filters.genre);
  if (filters.rating > 0) params.append('minRating', filters.rating);
  if (searchQuery) params.append('q', searchQuery);
  
  return params;
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { books } = getState();
      const params = buildQueryParams(books);
      
      const response = await axios.get(API_URL, { params });
      const { data, pagination } = response.data;
      
      // Transform the data if needed
      const transformedBooks = Array.isArray(data) ? data.map(book => ({
        ...book,
        // Ensure all required fields have default values
        genres: Array.isArray(book.genres) ? book.genres : [],
        averageRating: book.averageRating || 0,
        reviewCount: book.reviewCount || 0,
      })) : [];
      
      return {
        books: transformedBooks,
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 12,
          total: 0,
          totalPages: 1,
        },
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch books. Please try again.'
      );
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch book');
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, bookData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create book');
    }
  }
);

// Slice
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.pagination.page = 1; // Reset to first page on new search
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page on filter change
    },
    setSort(state, action) {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy || 'title';
      state.sortOrder = sortOrder || 'asc';
    },
    setPage(state, action) {
      state.pagination.page = Math.max(1, action.payload);
    },
    clearFilters(state) {
      state.searchQuery = '';
      state.filters = { genre: '', rating: 0 };
      state.sortBy = 'title';
      state.sortOrder = 'asc';
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        // Only set loading to true if we don't have any books yet
        // This allows us to show a loading spinner for the initial load
        // but not when loading more books (infinite scroll)
        if (state.books.length === 0) {
          state.loading = true;
        } else {
          state.loading = 'updating';
        }
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        const { books, pagination } = action.payload;
        
        // If it's the first page, replace the books, otherwise append
        state.books = pagination.page === 1 
          ? books 
          : [...state.books, ...books];
          
        state.pagination = {
          ...state.pagination,
          ...pagination,
        };
        
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' 
          ? action.payload 
          : 'Failed to fetch books. Please try again.';
        
        // Only clear books if it's the first page load
        if (state.pagination.page === 1) {
          state.books = [];
          state.pagination = {
            ...state.pagination,
            total: 0,
            totalPages: 1,
          };
        }
      });

    builder.addCase(fetchBookById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBookById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentBook = action.payload.data;
    });
    builder.addCase(fetchBookById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch book';
    });

    // Create Book
    builder.addCase(createBook.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBook.fulfilled, (state, action) => {
      state.loading = false;
      state.books.unshift(action.payload.data);
      state.pagination.total += 1;
    });
    builder.addCase(createBook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create book';
    });
  },
});

// Export actions
export const { 
  setSearchQuery, 
  setFilters, 
  setSort, 
  setPage, 
  clearFilters 
} = booksSlice.actions;

// Selectors
export const selectBooks = (state) => state.books.books || [];
export const selectCurrentBook = (state) => state.books.currentBook;

export const selectBooksLoading = (state) => {
  const { loading } = state.books;
  return loading === true || loading === 'updating';
};

export const selectIsInitialLoading = (state) => state.books.loading === true;

export const selectBooksError = (state) => state.books.error;

export const selectBooksPagination = (state) => ({
  page: state.books.pagination.page || 1,
  limit: state.books.pagination.limit || 12,
  total: state.books.pagination.total || 0,
  totalPages: state.books.pagination.totalPages || 1,
});

export const selectBooksFilters = (state) => ({
  genre: state.books.filters.genre || '',
  rating: state.books.filters.rating || 0,
});

export const selectBooksSort = (state) => ({
  sortBy: state.books.sortBy || 'title',
  sortOrder: state.books.sortOrder || 'asc',
});

export const selectHasMoreBooks = (state) => {
  const { page, totalPages } = state.books.pagination;
  return page < totalPages;
};

export default booksSlice.reducer;
