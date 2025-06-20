import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Logging in user:', { email });
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please check your credentials and try again.'
      );
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      console.log('Requesting password reset for email:', email);
      const response = await api.post('/auth/forgotpassword', { email });
      console.log('Forgot password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message ||
        'Failed to send password reset email. Please try again.'
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      console.log('Resetting password with token:', token.substring(0, 10) + '...');
      const response = await api.put(`/auth/resetpassword/${token}`, { password });
      console.log('Reset password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message ||
        'Failed to reset password. The link may have expired. Please try again.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password, role = 'user' }, { rejectWithValue }) => {
    try {
      console.log('Registering user:', { username, email, role });
      const response = await api.post('/auth/register', {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password,
        role
      });
      
      console.log('Registration successful:', response.data);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set user data in localStorage for persistence
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found in localStorage');
      return rejectWithValue('No token found');
    }

    console.log('Loading user with token:', token.substring(0, 10) + '...');
    
    // The API interceptor will handle adding the token to the headers
    const response = await api.get('/auth/me');
    console.log('User loaded successfully:', response.data);
    
    // Store the user data in localStorage for persistence
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    
    // Return the user data
    return response.data;
  } catch (error) {
    console.error('Error loading user:', error);
    // Clear invalid token
    localStorage.removeItem('token');
    
    return rejectWithValue(
      error.response?.data?.message || 
      error.message || 
      'Failed to load user. Please log in again.'
    );
  }
});

// Load user from localStorage if available
const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      return {
        user: JSON.parse(userData),
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
        resetEmailSent: false,
        passwordReset: false,
      };
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    // Clear invalid data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  
  // Default state
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    resetEmailSent: false,
    passwordReset: false,
  };
};

const initialState = loadUserFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.resetEmailSent = false;
      state.passwordReset = false;
      // Clear auth header
      delete api.defaults.headers.common['Authorization'];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.resetEmailSent = false;
      state.passwordReset = false;
    },
  },
  extraReducers(builder) {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        console.log('register.fulfilled:', payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload?.user || null;
        state.token = payload?.token || null;
        state.error = null;
        
        // Store token in localStorage
        if (payload?.token) {
          localStorage.setItem('token', payload.token);
          // Store user data in localStorage for persistence
          if (payload?.user) {
            localStorage.setItem('user', JSON.stringify(payload.user));
          }
          // Update axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
        }
      })
      .addCase(register.rejected, (state, { payload }) => {
        console.error('register.rejected:', payload);
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = payload || 'Registration failed';
        
        // Clear any invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        console.log('login.fulfilled:', payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload?.user || null;
        state.token = payload?.token || null;
        state.error = null;
        
        // Store token in localStorage
        if (payload?.token) {
          localStorage.setItem('token', payload.token);
          // Store user data in localStorage for persistence
          if (payload?.user) {
            localStorage.setItem('user', JSON.stringify(payload.user));
          }
          // Update axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
        }
      })
      .addCase(login.rejected, (state, { payload }) => {
        console.error('login.rejected:', payload);
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = payload || 'Login failed';
        
        // Clear any invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetEmailSent = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetEmailSent = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.resetEmailSent = false;
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordReset = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordReset = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.passwordReset = false;
      })
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        console.log('loadUser.fulfilled:', payload);
        state.loading = false;
        state.isAuthenticated = true;
        // The user data is in payload.data, not payload.user
        state.user = payload?.data || payload?.user || null;
        state.token = localStorage.getItem('token');
        state.error = null;
        
        // Ensure token is in axios headers
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      })
      .addCase(loadUser.rejected, (state, { payload }) => {
        console.error('loadUser.rejected:', payload);
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = payload || 'Failed to load user';
        
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      });
  },
});

export const { logout, clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
