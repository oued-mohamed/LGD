// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password'
};

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me'
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID: 'Please enter a valid email address',
    MAX_LENGTH: 254
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 8,
    MIN_LENGTH_MSG: 'Password must be at least 8 characters',
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    PATTERN_MSG: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  },
  NAME: {
    REQUIRED: 'Name is required',
    MIN_LENGTH: 2,
    MIN_LENGTH_MSG: 'Name must be at least 2 characters',
    MAX_LENGTH: 50,
    MAX_LENGTH_MSG: 'Name cannot exceed 50 characters'
  }
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};