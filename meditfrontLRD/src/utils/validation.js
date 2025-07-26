import { VALIDATION_RULES } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return VALIDATION_RULES.EMAIL.REQUIRED;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return VALIDATION_RULES.EMAIL.INVALID;
  }
  
  if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
    return `Email cannot exceed ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters`;
  }
  
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return VALIDATION_RULES.PASSWORD.REQUIRED;
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return VALIDATION_RULES.PASSWORD.MIN_LENGTH_MSG;
  }
  
  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    return VALIDATION_RULES.PASSWORD.PATTERN_MSG;
  }
  
  return '';
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return '';
};

// Name validation
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return VALIDATION_RULES.NAME.REQUIRED;
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return VALIDATION_RULES.NAME.MIN_LENGTH_MSG;
  }
  
  if (trimmedName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return VALIDATION_RULES.NAME.MAX_LENGTH_MSG;
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  
  return '';
};

// Required field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

// Validate entire login form
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validateRequired(formData.password, 'Password');
  if (passwordError) errors.password = passwordError;
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Validate entire registration form
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const firstNameError = validateName(formData.firstName);
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateName(formData.lastName);
  if (lastNameError) errors.lastName = lastNameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  if (formData.termsAccepted === false) {
    errors.termsAccepted = 'You must accept the terms and conditions';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};