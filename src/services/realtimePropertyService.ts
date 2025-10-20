import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  DocumentSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, FirestoreProperty } from '@/lib/firestore-collections';

export interface PropertyWithId extends FirestoreProperty {
  id: string;
}

export interface PaginationState {
  lastVisible: DocumentSnapshot | null;
  hasMore: boolean;
  loading: boolean;
}

/**
 * Real-time property listener with pagination support
 * Returns unsubscribe function to stop listening
 */
export const subscribeToProperties = (
  callback: (properties: PropertyWithId[], error?: Error) => void,
  options: {
    pageSize?: number;
    filters?: {
      availability?: boolean;
      minPrice?: number;
      maxPrice?: number;
    };
    lastVisible?: DocumentSnapshot | null;
  } = {}
): (() => void) => {
  const { pageSize = 20, filters, lastVisible } = options;

  try {
    // Build query constraints
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
    ];

    // Add filters
    if (filters?.availability !== undefined) {
      constraints.push(where('availability', '==', filters.availability));
    }
    if (filters?.minPrice !== undefined) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters?.maxPrice !== undefined) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }

    // Add pagination
    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }
    constraints.push(limit(pageSize));

    const q = query(collection(db, COLLECTIONS.PROPERTIES), ...constraints);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const properties: PropertyWithId[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as PropertyWithId));

        callback(properties);
      },
      (error) => {
        console.error('Error in property listener:', error);
        callback([], error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up property listener:', error);
    callback([], error as Error);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Load more properties (for pagination)
 */
export const loadMoreProperties = async (
  lastVisible: DocumentSnapshot,
  pageSize: number = 20,
  filters?: {
    availability?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }
): Promise<{
  properties: PropertyWithId[];
  lastVisible: DocumentSnapshot | null;
  hasMore: boolean;
}> => {
  try {
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible),
      limit(pageSize + 1), // Request one extra to check if there are more
    ];

    // Add filters
    if (filters?.availability !== undefined) {
      constraints.push(where('availability', '==', filters.availability));
    }
    if (filters?.minPrice !== undefined) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters?.maxPrice !== undefined) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }

    const q = query(collection(db, COLLECTIONS.PROPERTIES), ...constraints);
    const snapshot = await getDocs(q);

    const hasMore = snapshot.docs.length > pageSize;
    const properties: PropertyWithId[] = snapshot.docs
      .slice(0, pageSize) // Take only requested amount
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as PropertyWithId));

    const newLastVisible = properties.length > 0 
      ? snapshot.docs[properties.length - 1] 
      : null;

    return {
      properties,
      lastVisible: newLastVisible,
      hasMore,
    };
  } catch (error) {
    console.error('Error loading more properties:', error);
    return {
      properties: [],
      lastVisible: null,
      hasMore: false,
    };
  }
};

/**
 * Search properties with debouncing
 * Returns unsubscribe function
 */
export const searchProperties = (
  searchTerm: string,
  callback: (properties: PropertyWithId[]) => void
): (() => void) => {
  if (!searchTerm.trim()) {
    callback([]);
    return () => {};
  }

  // Note: Firestore doesn't support full-text search natively
  // For production, consider using Algolia or ElasticSearch
  // This is a basic implementation that searches by title prefix

  const q = query(
    collection(db, COLLECTIONS.PROPERTIES),
    where('title', '>=', searchTerm),
    where('title', '<=', searchTerm + '\uf8ff'),
    limit(10)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const properties: PropertyWithId[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as PropertyWithId));

    callback(properties);
  });

  return unsubscribe;
};

