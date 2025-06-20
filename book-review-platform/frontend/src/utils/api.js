import axios from 'axios';
import { logout } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/v1',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We export a function to set up the response interceptor to avoid circular dependencies with the store.
export const setupResponseInterceptor = (store) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check for 401 Unauthorized and ensure it's not a retry request
      if (error.response?.status === 401 && !error.config._retry) {
        console.log('API interceptor: 401 Unauthorized. Logging out.');
        // Dispatch logout action to gracefully handle session expiry
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};

export default api;
