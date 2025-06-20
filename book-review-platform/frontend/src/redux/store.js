import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';

// Initialize state from localStorage if available
const preloadedState = {};
const token = localStorage.getItem('token');

if (token) {
  preloadedState.auth = {
    token,
    isAuthenticated: false, // Will be set to true after loadUser succeeds
    loading: true,
    user: null,
    error: null
  };
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
  },
  preloadedState,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loadUser/fulfilled', 'auth/loadUser/rejected'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export default store;
