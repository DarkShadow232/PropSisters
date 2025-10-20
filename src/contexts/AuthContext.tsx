import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, signInWithGoogle as firebaseGoogleSignIn, signOutUser } from '@/lib/firebase';
import { authService } from '@/services/authService';

// Define user roles
export type UserRole = 'user' | 'owner' | 'admin';
export type AuthProvider = 'email' | 'google';

// User interface
export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified?: boolean;
}

// Define the shape of the auth context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { displayName?: string; phoneNumber?: string; photoURL?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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

  // Sign in with Google (Firebase OAuth + MongoDB storage)
  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // 1. Sign in with Firebase (Google OAuth)
      const firebaseUser = await firebaseGoogleSignIn();
      
      // 2. Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // 3. Send token to backend for verification and MongoDB storage
      const response = await authService.authenticateWithGoogle(idToken);
      
      if (response.success && response.user) {
        setCurrentUser(response.user as User);
      } else {
        throw new Error('Failed to authenticate with Google');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Sign out from Firebase if backend auth failed
      await signOutUser().catch(console.error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password (MongoDB only)
  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await authService.login({ email, password });
      
      if (response.success && response.user) {
        setCurrentUser(response.user as User);
      } else {
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
  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      
      const response = await authService.register({
        email,
        password,
        displayName
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

  // Sign out
  const handleSignOut = async () => {
    try {
      // Sign out from backend (destroy session)
      await authService.logout();
      
      // If user was signed in with Google, also sign out from Firebase
      if (currentUser?.authProvider === 'google') {
        await signOutUser().catch(console.error);
      }
      
      setCurrentUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Update profile
  const handleUpdateProfile = async (updates: { 
    displayName?: string; 
    phoneNumber?: string;
    photoURL?: string 
  }) => {
    try {
      const response = await authService.updateProfile(updates);
      
      if (response.success && response.user) {
        setCurrentUser(response.user as User);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Change password
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
