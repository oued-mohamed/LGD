import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
  const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();

  const email = location.state?.email || '';
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerification(token);
    }
  }, [token]);

  const handleVerification = async (verificationToken) => {
    try {
      setStatus('pending');
      await verifyEmail(verificationToken);
      setStatus('success');
      setMessage('Email verified successfully! You can now access all features.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Email verification failed. The link may be expired or invalid.');
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setMessage('No email address available for resending.');
      return;
    }

    setIsResending(true);
    try {
      // You would implement resend logic here
      // await authService.resendVerificationEmail(email);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to resend email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          {status === 'pending' && (
            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {status === 'success' && (
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === 'error' && (
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {!token && (
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {status === 'success' ? 'Email Verified!' : 
           status === 'error' ? 'Verification Failed' : 
           token ? 'Verifying Email...' : 'Check Your Email'}
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          {!token && email && `We sent a verification link to ${email}`}
          {!token && !email && 'Please check your email for the verification link'}
          {token && status === 'pending' && 'Please wait while we verify your email...'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className={`mb-4 p-4 rounded-md ${
              status === 'success' ? 'bg-green-50 text-green-800' : 
              status === 'error' ? 'bg-red-50 text-red-800' : 
              'bg-blue-50 text-blue-800'
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="space-y-4">
            {status === 'success' && (
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </Link>
            )}

            {(status === 'error' || (!token && email)) && (
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}

            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;