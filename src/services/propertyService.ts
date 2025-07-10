import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, FirestoreProperty } from '@/lib/firestore-collections';

// Get all properties
export const getAllProperties = async (): Promise<FirestoreProperty[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROPERTIES));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreProperty));
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

// Get property by ID
export const getPropertyById = async (propertyId: string): Promise<FirestoreProperty | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreProperty;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};

// Add new property
export const addProperty = async (property: Omit<FirestoreProperty, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROPERTIES), {
      ...property,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

// Update property
export const updateProperty = async (propertyId: string, updates: Partial<FirestoreProperty>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.PROPERTIES, propertyId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

// Delete property
export const deleteProperty = async (propertyId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PROPERTIES, propertyId));
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

// Get properties by owner
export const getPropertiesByOwner = async (ownerId: string): Promise<FirestoreProperty[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROPERTIES),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreProperty));
  } catch (error) {
    console.error('Error getting properties by owner:', error);
    throw error;
  }
};

// Search properties
export const searchProperties = async (filters: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  amenities?: string[];
}): Promise<FirestoreProperty[]> => {
  try {
    let q = query(collection(db, COLLECTIONS.PROPERTIES));
    
    if (filters.location) {
      q = query(q, where('location', '==', filters.location));
    }
    
    if (filters.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice));
    }
    
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }
    
    if (filters.bedrooms) {
      q = query(q, where('bedrooms', '==', filters.bedrooms));
    }
    
    // Note: Firestore doesn't support array-contains-any with other queries
    // You might need to filter amenities client-side
    
    const querySnapshot = await getDocs(q);
    let properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreProperty));
    
    // Client-side filtering for amenities
    if (filters.amenities && filters.amenities.length > 0) {
      properties = properties.filter(property => 
        filters.amenities!.some(amenity => property.amenities.includes(amenity))
      );
    }
    
    return properties;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}; 