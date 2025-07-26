import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validateRequired } from '../../utils/validation';

const LoginForm = ({ onSuccess, redirectTo = '/dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    isLoading: false,
    errors: {},
    rememberMe: false,
  });

  // Get redirect URL from location state or use default
  const from = location.state?.from?.pathname || redirectTo;

  // Clear auth errors when component mounts - FIX: Remove clearError dependency
  useEffect(() => {
    clearError();
  }, []); // Empty dependency array prevents infinite loop

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      errors: {
        ...prev.errors,
        [name]: '', // Clear field error when user starts typing
      }
    }));

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Validate form
const validateForm = () => {
  const errors = {};

  // Email validation - check if there's an error message
  const emailError = validateEmail(formState.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Password validation - check if there's an error message  
  const passwordError = validateRequired(formState.password, 'Password');
  if (passwordError) {
    errors.password = passwordError;
  }

  setFormState(prev => ({ ...prev, errors }));
  return Object.keys(errors).length === 0;
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      await login({
        email: formState.email.trim(),
        password: formState.password,
        rememberMe: formState.rememberMe,
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Navigate to dashboard or redirect URL
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            general: 'Invalid email or password'
          }
        }));
      } else if (error.response?.status === 429) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            general: 'Too many login attempts. Please try again later.'
          }
        }));
      }
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const isFormLoading = formState.isLoading || isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to MeditFront
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Global Error */}
          {(error || formState.errors.general) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    {error || formState.errors.general}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  disabled={isFormLoading}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    formState.errors.email
                      ? 'border-red-300 text-red-900 placeholder-red-300'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isFormLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your email"
                />
                {formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{formState.errors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formState.password}
                  onChange={handleInputChange}
                  disabled={isFormLoading}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    formState.errors.password
                      ? 'border-red-300 text-red-900 placeholder-red-300'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isFormLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your password"
                />
                {formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{formState.errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formState.rememberMe}
                onChange={handleInputChange}
                disabled={isFormLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isFormLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isFormLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition duration-150 ease-in-out`}
            >
              {isFormLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isFormLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;