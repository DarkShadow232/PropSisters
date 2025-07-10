import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, auth, signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore-collections';

// Define user roles
export type UserRole = 'user' | 'owner' | 'admin';

// Define the shape of the auth context
interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user role from Firestore
  const fetchUserRole = async (user: User): Promise<UserRole> => {
    try {
      const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role || 'user';
      } else {
        // Create new user document with default role
        const defaultRole: UserRole = 'user';
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: defaultRole,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return defaultRole;
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user'; // Default fallback
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let mounted = true;
    
    try {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (mounted) {
          setCurrentUser(user);
          
          if (user) {
            // Fetch user role when user is authenticated
            const role = await fetchUserRole(user);
            if (mounted) {
              setUserRole(role);
            }
          } else {
            // Clear user role when user signs out
            setUserRole(null);
          }
          
          if (mounted) {
            setLoading(false);
          }
        }
      });

      // Timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('Firebase auth initialization timeout');
          setLoading(false);
        }
      }, 5000); // 5 seconds timeout

      // Cleanup subscription on unmount
      return () => {
        mounted = false;
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      if (mounted) {
        setLoading(false);
      }
    }
  }, []);

  // Sign in with Google
  const handleSignInWithGoogle = async () => {
    try {
      return await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const handleSignIn = async (email: string, password: string) => {
    try {
      return await signInWithEmail(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign up with email and password
  const handleSignUp = async (email: string, password: string) => {
    try {
      return await signUpWithEmail(email, password);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
