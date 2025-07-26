import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-yellow-100 mb-6">
            <svg
              className="h-12 w-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H9m12-5a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">403 - Unauthorized</h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, you don't have permission to access this page. This might be because:
          </p>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 text-left max-w-md mx-auto">
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You need special permissions to view this content
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your account role doesn't allow access to this feature
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your session may have expired
              </li>
            </ul>
          </div>

          {/* Current User Info */}
          {user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Current user:</strong> {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-blue-600">
                <strong>Email:</strong> {user.email}
              </p>
              {user.roles && user.roles.length > 0 && (
                <p className="text-sm text-blue-600">
                  <strong>Role:</strong> {user.roles.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>
          </div>

          {/* Additional Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need different access?
            </p>
            <div className="space-y-2 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-500 transition duration-150 ease-in-out"
                  >
                    Sign Out
                  </button>
                  <Link
                    to="/profile"
                    className="text-sm text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                  >
                    View Profile
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                >
                  Sign In
                </Link>
              )}
              <a
                href="mailto:support@meditfront.com"
                className="text-sm text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;