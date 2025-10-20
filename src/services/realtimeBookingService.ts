import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, FirestoreBooking } from '@/lib/firestore-collections';

export interface BookingWithId extends FirestoreBooking {
  id: string;
}

/**
 * Real-time booking listener
 * Returns unsubscribe function
 */
export const subscribeToBookings = (
  callback: (bookings: BookingWithId[], error?: Error) => void,
  filters?: {
    status?: 'pending' | 'confirmed' | 'cancelled';
    propertyId?: string;
    userId?: string;
  }
): (() => void) => {
  try {
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
    ];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.propertyId) {
      constraints.push(where('propertyId', '==', filters.propertyId));
    }
    if (filters?.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }

    const q = query(collection(db, COLLECTIONS.BOOKINGS), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookings: BookingWithId[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          checkIn: doc.data().checkIn?.toDate() || new Date(),
          checkOut: doc.data().checkOut?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as BookingWithId));

        callback(bookings);
      },
      (error) => {
        console.error('Error in booking listener:', error);
        callback([], error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up booking listener:', error);
    callback([], error as Error);
    return () => {};
  }
};

