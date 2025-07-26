import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// Custom hook to use auth context with additional utilities
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Hook to check if user has specific permissions
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = (permission) => {
    if (!isAuthenticated || !user) return false;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (role) => {
    if (!isAuthenticated || !user) return false;
    return user.roles?.includes(role) || false;
  };

  const hasAnyRole = (roles) => {
    if (!isAuthenticated || !user) return false;
    return roles.some(role => user.roles?.includes(role));
  };

  const hasAllRoles = (roles) => {
    if (!isAuthenticated || !user) return false;
    return roles.every(role => user.roles?.includes(role));
  };

  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole('moderator');
  const isVerified = () => user?.emailVerified || false;

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isModerator,
    isVerified,
    permissions: user?.permissions || [],
    roles: user?.roles || []
  };
};

export default useAuth;