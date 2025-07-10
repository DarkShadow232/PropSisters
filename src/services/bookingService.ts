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
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, FirestoreBooking } from '@/lib/firestore-collections';

// Create a new booking
export const createBooking = async (bookingData: Omit<FirestoreBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), {
      ...bookingData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get all bookings
export const getAllBookings = async (): Promise<FirestoreBooking[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkIn: doc.data().checkIn.toDate(),
      checkOut: doc.data().checkOut.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as FirestoreBooking));
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId: string): Promise<FirestoreBooking | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        checkIn: data.checkIn.toDate(),
        checkOut: data.checkOut.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as FirestoreBooking;
    }
    return null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
};

// Get bookings by user ID
export const getBookingsByUserId = async (userId: string): Promise<FirestoreBooking[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkIn: doc.data().checkIn.toDate(),
      checkOut: doc.data().checkOut.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as FirestoreBooking));
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
};

// Get bookings by property ID
export const getBookingsByPropertyId = async (propertyId: string): Promise<FirestoreBooking[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('propertyId', '==', propertyId),
      orderBy('checkIn', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkIn: doc.data().checkIn.toDate(),
      checkOut: doc.data().checkOut.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as FirestoreBooking));
  } catch (error) {
    console.error('Error getting property bookings:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// Update booking
export const updateBooking = async (bookingId: string, updates: Partial<Omit<FirestoreBooking, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Delete booking
export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// Check if dates are available for a property
export const checkDateAvailability = async (propertyId: string, checkIn: Date, checkOut: Date): Promise<boolean> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('propertyId', '==', propertyId),
      where('status', 'in', ['pending', 'confirmed'])
    );
    const querySnapshot = await getDocs(q);
    
    const bookings = querySnapshot.docs.map(doc => ({
      checkIn: doc.data().checkIn.toDate(),
      checkOut: doc.data().checkOut.toDate()
    }));
    
    // Check for date conflicts
    for (const booking of bookings) {
      if (
        (checkIn >= booking.checkIn && checkIn < booking.checkOut) ||
        (checkOut > booking.checkIn && checkOut <= booking.checkOut) ||
        (checkIn <= booking.checkIn && checkOut >= booking.checkOut)
      ) {
        return false; // Dates are not available
      }
    }
    
    return true; // Dates are available
  } catch (error) {
    console.error('Error checking date availability:', error);
    throw error;
  }
};

// Get booked dates for a property (for calendar display)
export const getBookedDates = async (propertyId: string): Promise<string[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.BOOKINGS),
      where('propertyId', '==', propertyId),
      where('status', 'in', ['pending', 'confirmed'])
    );
    const querySnapshot = await getDocs(q);
    
    const bookedDates: string[] = [];
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      const checkIn = data.checkIn.toDate();
      const checkOut = data.checkOut.toDate();
      
      // Add all dates between checkIn and checkOut
      const currentDate = new Date(checkIn);
      while (currentDate < checkOut) {
        bookedDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return bookedDates;
  } catch (error) {
    console.error('Error getting booked dates:', error);
    throw error;
  }
};

// Get booking statistics for admin dashboard
export const getBookingStats = async (): Promise<{
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
    
    let totalBookings = 0;
    let pendingBookings = 0;
    let confirmedBookings = 0;
    let cancelledBookings = 0;
    let totalRevenue = 0;
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalBookings++;
      
      switch (data.status) {
        case 'pending':
          pendingBookings++;
          break;
        case 'confirmed':
          confirmedBookings++;
          totalRevenue += data.totalPrice;
          break;
        case 'cancelled':
          cancelledBookings++;
          break;
      }
    });
    
    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue
    };
  } catch (error) {
    console.error('Error getting booking stats:', error);
    throw error;
  }
};