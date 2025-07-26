import axios from 'axios';
import { API_BASE_URL, HTTP_STATUS, AUTH_ENDPOINTS } from '../utils/constants';
import storageService from '../utils/storage';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor - add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = storageService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = storageService.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data;
              
              storageService.setTokens(accessToken, refreshToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            storageService.clearAuthData();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request(method, url, data = null, options = {}) {
    try {
      const config = {
        method,
        url,
        ...options,
      };

      if (data) {
        if (method.toLowerCase() === 'get') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await this.api(config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // HTTP methods
  get(url, params = null, options = {}) {
    return this.request('GET', url, params, options);
  }

  post(url, data = null, options = {}) {
    return this.request('POST', url, data, options);
  }

  put(url, data = null, options = {}) {
    return this.request('PUT', url, data, options);
  }

  patch(url, data = null, options = {}) {
    return this.request('PATCH', url, data, options);
  }

  delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }

  // Refresh token method (no interceptor to avoid infinite loop)
  async refreshToken(refreshToken) {
    return axios.post(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
      refreshToken,
    });
  }

  // Error handling
  handleError(error) {
    const errorResponse = {
      message: 'An unexpected error occurred',
      status: null,
      data: null,
    };

    if (error.response) {
      // Server responded with error status
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
      errorResponse.message = error.response.data?.message || error.response.statusText;
    } else if (error.request) {
      // Request made but no response
      errorResponse.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      errorResponse.message = error.message;
    }

    console.error('API Error:', errorResponse);
    return errorResponse;
  }

  // File upload method
  async uploadFile(url, file, onUploadProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('POST', url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  }
}

export default new ApiService();