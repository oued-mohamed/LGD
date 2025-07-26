import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateRegisterForm } from '../../utils/validation';

const RegisterForm = ({ onSuccess, redirectTo = '/dashboard' }) => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    marketingEmails: false,
    isLoading: false,
    errors: {},
    showPassword: false,
    showConfirmPassword: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

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

    // Update password strength for password field
    if (name === 'password') {
      updatePasswordStrength(value);
    }

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Calculate password strength
  const updatePasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Fair';
        break;
      case 4:
        feedback = 'Good';
        break;
      case 5:
        feedback = 'Strong';
        break;
      default:
        feedback = '';
    }

    setPasswordStrength({ score, feedback });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setFormState(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate and submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateRegisterForm(formState);
    if (!validation.isValid) {
      setFormState(prev => ({ ...prev, errors: validation.errors }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await register({
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        email: formState.email.trim().toLowerCase(),
        password: formState.password,
        marketingEmails: formState.marketingEmails,
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

      // Navigate based on registration result
      if (result.accessToken) {
        // Auto-login successful
        navigate(redirectTo, { replace: true });
      } else {
        // Email verification required
        navigate('/verify-email', { 
          state: { 
            email: formState.email,
            message: result.message 
          }
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle specific error cases
      if (error.status === 409) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            email: 'An account with this email already exists'
          }
        }));
      } else if (error.status === 429) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            general: 'Too many registration attempts. Please try again later.'
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join MeditFront today
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Global Error */}
          {(error || formState.errors.general) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formState.firstName}
                  onChange={handleInputChange}
                  disabled={isFormLoading}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formState.errors.firstName
                      ? 'border-red-300 text-red-900 placeholder-red-300'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isFormLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="First name"
                />
                {formState.errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formState.errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formState.lastName}
                  onChange={handleInputChange}
                  disabled={isFormLoading}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    formState.errors.lastName
                      ? 'border-red-300 text-red-900 placeholder-red-300'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isFormLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Last name"
                />
                {formState.errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{formState.errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formState.email}
                onChange={handleInputChange}
                disabled={isFormLoading}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={formState.showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formState.password}
                  onChange={handleInputChange}
                  disabled={isFormLoading}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    formState.errors.password
                      ? 'border-red-300 text-red-900 placeholder-red-300'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isFormLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('showPassword')}
                  disabled={isFormLoading}
                >
                  {formState.showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L21 21" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formState.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score === 3 ? 'text-yellow-600' :
                      passwordStrength.score === 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2 ? 'bg-red-500' :
                        passwordStrength.score === 3 ? 'bg-yellow-500' :
                        passwordStrength.score === 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={formState.showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formState.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isFormLoading}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    formState.errors.confirmPassword
                      ? 'border-red-300 text-red-900 placeholder-red-300'
                      : 'border-gray-300 text-gray-900 placeholder-gray-500'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                    isFormLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('showConfirmPassword')}
                  disabled={isFormLoading}
                >
                  {formState.showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formState.termsAccepted}
                onChange={handleInputChange}
                disabled={isFormLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
                <span className="text-red-500 ml-1">*</span>
              </label>
            </div>
            {formState.errors.termsAccepted && (
              <p className="text-sm text-red-600 ml-6">{formState.errors.termsAccepted}</p>
            )}

            {/* Marketing Emails */}
            <div className="flex items-start">
              <input
                id="marketingEmails"
                name="marketingEmails"
                type="checkbox"
                checked={formState.marketingEmails}
                onChange={handleInputChange}
                disabled={isFormLoading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-900">
                I would like to receive product updates and marketing emails
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isFormLoading || !formState.termsAccepted}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isFormLoading || !formState.termsAccepted
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
              {isFormLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;