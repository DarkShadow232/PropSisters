import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';

// Define user roles
export type UserRole = 'user' | 'owner' | 'admin';

// User interface
export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: UserRole;
  isEmailVerified?: boolean;
}

// Define the shape of the auth context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, phoneNumber?: string) => Promise<void>;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: { displayName?: string; phoneNumber?: string; photoURL?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const response = await authService.verifySession();
        if (mounted && response.success && response.user) {
          setCurrentUser(response.user as User);
        }
      } catch (error) {
        console.log('No active session');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Session check timeout');
        setLoading(false);
      }
    }, 5000);

    checkSession();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Sign in with email and password (MongoDB only)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      console.log('Attempting to sign in with:', { email, password: '***' });
      const response = await authService.login({ email, password });
      console.log('Login response:', response);
      
      if (response.success && response.user) {
        setCurrentUser(response.user as User);
        console.log('User set successfully:', response.user);
      } else {
        console.error('Login failed:', response);
        throw new Error(response.message || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password (MongoDB only)
  const signUp = async (email: string, password: string, displayName: string, phoneNumber?: string) => {
    try {
      setLoading(true);
      
      const response = await authService.register({ 
        email, 
        password, 
        displayName, 
        phoneNumber: phoneNumber || '' 
      });
      
      if (response.success && response.user) {
        setCurrentUser(response.user as User);
      } else {
        throw new Error(response.message || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://api.propsiss.com';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  // Sign out
  const signOut = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear the user even if logout fails
      setCurrentUser(null);
    }
  };

  // Update user profile
  const updateProfile = async (updates: { 
    displayName?: string; 
    phoneNumber?: string; 
    photoURL?: string 
  }) => {
    try {
      const response = await authService.updateProfile(updates);
      
      if (response.success && response.user) {
        setCurrentUser(response.user as User);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;