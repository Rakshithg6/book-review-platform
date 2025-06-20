import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) =>
  api.post('/users/login', credentials);

export const register = (userData) =>
  api.post('/users/register', userData);

export const getBooks = (page = 1, limit = 10) => 
  api.get(`/books?page=${page}&limit=${limit}`);

export const getBook = (id) => 
  api.get(`/books/${id}`);

export const addBook = (bookData) => 
  api.post('/books', bookData);

export const getReviews = (bookId) => 
  api.get(`/reviews?bookId=${bookId}`);

export const addReview = (reviewData) => 
  api.post('/reviews', reviewData);

export const getUserProfile = (id) => 
  api.get(`/users/${id}`);

export const updateUserProfile = (id, userData) => 
  api.put(`/users/${id}`, userData);

export default api;