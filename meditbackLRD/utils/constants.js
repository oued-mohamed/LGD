
// User roles
const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

// Response messages - EXPANDED
const MESSAGES = {
  // User management
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_NOT_FOUND: 'User not found',
  
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'User logged out successfully',
  INVALID_CREDENTIALS: 'Invalid credentials',
  MISSING_CREDENTIALS: 'Please provide an email and password',
  
  // Authorization
  UNAUTHORIZED: 'Not authorized to access this route',
  FORBIDDEN: 'Access forbidden',
  
  // Validation
  EMAIL_ALREADY_EXISTS: 'User already exists with this email',
  VALIDATION_ERROR: 'Validation failed',
  EMAIL_REQUIRED: 'Please provide a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  FIRST_NAME_REQUIRED: 'First name is required',
  LAST_NAME_REQUIRED: 'Last name is required',
  FIRST_NAME_LENGTH: 'First name must be between 2 and 50 characters',
  LAST_NAME_LENGTH: 'Last name must be between 2 and 50 characters',
  PASSWORD_STRENGTH: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  
  // Server errors
  SERVER_ERROR: 'Internal server error',
  RESOURCE_NOT_FOUND: 'Resource not found',
  DUPLICATE_FIELD: 'Duplicate field value entered',
  
  // Token errors
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  
  // Generic
  SUCCESS: 'Operation successful',
  OPERATION_FAILED: 'Operation failed'
};

// HTTP Status Codes
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Token expiration times
const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '30d',
  REFRESH_TOKEN: '90d',
  EMAIL_VERIFICATION: '24h',
  PASSWORD_RESET: '1h'
};

// Validation rules
const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_MAX_LENGTH: 254
};

module.exports = {
  USER_ROLES,
  MESSAGES,
  STATUS_CODES,
  TOKEN_EXPIRY,
  VALIDATION_RULES
};