import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}) => {
  const { userRole, currentUser } = useAuth();

  // Don't render anything if user is not authenticated
  if (!currentUser) {
    return <>{fallback}</>;
  }

  // Don't render anything if user role is not set yet
  if (!userRole) {
    return <>{fallback}</>;
  }

  // Check if user role is in allowed roles
  if (!allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  // Render children if user has permission
  return <>{children}</>;
};

export default RoleGuard; 