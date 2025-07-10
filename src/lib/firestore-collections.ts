// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  DESIGN_REQUESTS: 'design_requests',
  MEMBERSHIPS: 'memberships'
} as const;

// Firestore data interfaces
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'user' | 'owner' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreProperty {
  id?: string;
  title: string;
  description: string;
  location: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreBooking {
  id?: string;
  propertyId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  cleaningService: boolean;
  airportPickup: boolean;
  earlyCheckIn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreReview {
  id?: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface FirestoreDesignRequest {
  id?: string;
  userId: string;
  address: string;
  serviceType: string;
  preferredStyle?: string;
  description: string;
  images: string[];
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreMembership {
  id?: string;
  userId: string;
  level: 'Silver' | 'Gold' | 'Platinum';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  points: number;
  createdAt: Date;
  updatedAt: Date;
} 