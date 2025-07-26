// User roles
const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

// Response messages
const MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  UNAUTHORIZED: 'Not authorized to access this route',
  FORBIDDEN: 'Access forbidden',
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed'
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

module.exports = {
  USER_ROLES,
  MESSAGES,
  STATUS_CODES,
  TOKEN_EXPIRY
};