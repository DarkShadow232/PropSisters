import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, FirestoreUser } from '@/lib/firestore-collections';

export interface UserWithId extends FirestoreUser {
  id: string;
}

/**
 * Real-time user listener
 * Returns unsubscribe function
 */
export const subscribeToUsers = (
  callback: (users: UserWithId[], error?: Error) => void,
  filters?: {
    role?: 'user' | 'owner' | 'admin';
  }
): (() => void) => {
  try {
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
    ];

    if (filters?.role) {
      constraints.push(where('role', '==', filters.role));
    }

    const q = query(collection(db, COLLECTIONS.USERS), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users: UserWithId[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as UserWithId));

        callback(users);
      },
      (error) => {
        console.error('Error in user listener:', error);
        callback([], error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up user listener:', error);
    callback([], error as Error);
    return () => {};
  }
};

