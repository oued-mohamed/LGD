import apiService from './api';
import { AUTH_ENDPOINTS } from '../utils/constants';
import storageService from '../utils/storage';

class AuthService {
  // Login user
  // Login user
async login(credentials) {
  try {
    const response = await apiService.post(AUTH_ENDPOINTS.LOGIN, credentials);
    
    // Backend login returns { success, accessToken, user }
    const { user, accessToken } = response; // CHANGED: token → accessToken
    
    // Store token and user data
    storageService.setTokens(accessToken, null, credentials.rememberMe);
    storageService.setUserData(user);
    
    return { user, accessToken, token: accessToken };
  } catch (error) {
    throw error;
  }
}

  // Register user
  async register(userData) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.REGISTER, userData);
      console.log('Register response:', response);

      
      // Backend returns { success, token, user } - adjust accordingly
      const { user, token } = response;
      
      // Store token and user data if auto-login is enabled (token exists)
      if (token) {
        storageService.setTokens(token, null, false);
        storageService.setUserData(user);
      }
      
      return { user, accessToken: token, token };
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const token = storageService.getAccessToken();
      
      if (token) {
        // Call logout endpoint to invalidate tokens on server
        await apiService.post(AUTH_ENDPOINTS.LOGOUT);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server request fails
    } finally {
      // Always clear local storage
      storageService.clearAuthData();
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiService.get(AUTH_ENDPOINTS.PROFILE);
      const user = response.data.data || response.data; // Handle both response formats
      
      // Update stored user data
      storageService.setUserData(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await apiService.put(AUTH_ENDPOINTS.PROFILE, userData);
      const user = response.data.data || response.data; // Handle both response formats
      
      // Update stored user data
      storageService.setUserData(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Request password reset
  async forgotPassword(email) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return storageService.isAuthenticated();
  }

  // Get stored user data
  getCurrentUserData() {
    return storageService.getUserData();
  }

  // Refresh access token (simplified for single token approach)
  async refreshAccessToken() {
    try {
      const token = storageService.getAccessToken();
      if (!token) {
        throw new Error('No token available');
      }

      // For now, just return existing token
      // You can implement refresh logic later if needed
      return token;
    } catch (error) {
      // If refresh fails, logout user
      storageService.clearAuthData();
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();