import { doc, updateDoc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateUserProfile } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore-collections';
import type { FirestoreUser } from '@/lib/firestore-collections';

// Update user profile in both Firebase Auth and Firestore
export const updateUserProfileData = async (
  userId: string,
  updates: {
    displayName?: string;
    phoneNumber?: string;
    photoURL?: string;
  }
): Promise<void> => {
  try {
    // Update Firebase Auth profile
    const authUpdates: { displayName?: string; photoURL?: string } = {};
    if (updates.displayName) authUpdates.displayName = updates.displayName;
    if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
    
    if (Object.keys(authUpdates).length > 0) {
      await updateUserProfile(authUpdates);
    }

    // Update Firestore user document
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const firestoreUpdates: Partial<FirestoreUser> = {
      ...updates,
      updatedAt: new Date()
    };

    await updateDoc(userRef, firestoreUpdates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (userId: string): Promise<FirestoreUser | null> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as FirestoreUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Create or update user profile in Firestore (for new users)
export const createOrUpdateUserProfile = async (
  userId: string,
  userData: Partial<FirestoreUser>
): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date()
      });
    } else {
      // Create new user
      await setDoc(userRef, {
        uid: userId,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...userData
      } as FirestoreUser);
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
}; 