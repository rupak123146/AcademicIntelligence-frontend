import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      // If backend is unreachable during development, save user locally for demo
      const networkErr = !(error && error.response);
      if (process.env.NODE_ENV === 'development' && networkErr) {
        console.warn('Auth service: backend unreachable — saving registration locally for demo.');
        const stored = localStorage.getItem('demoRegisteredUsers');
        const users = stored ? JSON.parse(stored) : [];
        // store raw userData (including password) only for local demo purposes
        users.push(userData);
        localStorage.setItem('demoRegisteredUsers', JSON.stringify(users));

        const user = {
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
          email: userData.email,
          role: userData.role || 'student'
        };

        return {
          user,
          token: 'demo-token'
        };
      }

      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      // If backend unreachable or user registered locally, provide local fallback in development
      const networkErr = !(error && error.response);
      if (process.env.NODE_ENV === 'development') {
        // built-in demo users
        const demoUsers = {
          'student@example.com': { name: 'Demo Student', role: credentials.role || 'student', email: 'student@example.com' },
          'faculty@example.com': { name: 'Demo Faculty', role: credentials.role || 'faculty', email: 'faculty@example.com' }
        };
        const demoPasswords = ['password123', 'password'];

        if (demoUsers[credentials.email] && demoPasswords.includes(credentials.password)) {
          return { user: demoUsers[credentials.email], token: 'demo-token' };
        }

        // check locally registered demo users saved during registration fallback
        try {
          const stored = localStorage.getItem('demoRegisteredUsers');
          if (stored) {
            const users = JSON.parse(stored);
            const matched = users.find((u) => u.email === credentials.email && u.password === credentials.password);
            if (matched) {
              const user = { name: `${matched.firstName || ''} ${matched.lastName || ''}`.trim() || matched.email, email: matched.email, role: matched.role || 'student' };
              return { user, token: 'demo-token' };
            }
          }
        } catch (e) {
          // ignore JSON parse errors
        }

        if (!networkErr) {
          // if request reached server but returned error, propagate server message
          throw error.response?.data || { message: 'Login failed' };
        }
      }

      // propagate server error message when available
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token refresh failed' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user data' };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  }
};

export default authService;
