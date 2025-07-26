import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireVerification = false,
  requiredRoles = [],
  fallbackComponent = null 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // Handle authentication requirements
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Handle reverse auth (redirect authenticated users away from auth pages)
  if (!requireAuth && isAuthenticated) {
    // Get intended destination or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // Handle email verification requirements
  if (requireAuth && isAuthenticated && requireVerification && !user?.emailVerified) {
    return (
      <Navigate 
        to="/verify-email" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Handle role-based access
  if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // Show fallback component or redirect to unauthorized page
      if (fallbackComponent) {
        return fallbackComponent;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // All checks passed, render the protected content
  return children;
};

// Higher-order component for easy wrapping
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific route protection components
export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const VerifiedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} requireVerification={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requiredRoles={['admin']} 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;