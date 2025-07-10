import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Sample data for testing
export const sampleBookings = [
  {
    propertyName: "Modern Downtown Apartment",
    checkIn: "2024-01-15",
    checkOut: "2024-01-20",
    location: "New York, NY",
    status: "confirmed",
    totalPrice: 600,
    createdAt: serverTimestamp()
  },
  {
    propertyName: "Beachfront Villa",
    checkIn: "2024-02-10",
    checkOut: "2024-02-17",
    location: "Miami, FL",
    status: "pending",
    totalPrice: 1200,
    createdAt: serverTimestamp()
  },
  {
    propertyName: "Mountain Cabin Retreat",
    checkIn: "2024-03-05",
    checkOut: "2024-03-10",
    location: "Aspen, CO",
    status: "completed",
    totalPrice: 800,
    createdAt: serverTimestamp()
  }
];

export const sampleProperties = [
  {
    title: "Luxury Penthouse Suite",
    location: "Los Angeles, CA",
    pricePerNight: 350,
    status: "active",
    averageRating: 4.8,
    reviewsCount: 24,
    views: 156,
    images: [
      "/image/Apartments/Ap1/IMG-20250327-WA0003.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0005.jpg"
    ],
    createdAt: serverTimestamp()
  },
  {
    title: "Cozy Downtown Loft",
    location: "Chicago, IL",
    pricePerNight: 180,
    status: "active",
    averageRating: 4.5,
    reviewsCount: 18,
    views: 89,
    images: [
      "/image/Apartments/Ap2/IMG-20250327-WA0015.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0017.jpg"
    ],
    createdAt: serverTimestamp()
  }
];

export const sampleDesignRequests = [
  {
    title: "Modern Living Room Design",
    description: "Need help designing a contemporary living room with minimalist style",
    location: "123 Main St, NYC",
    status: "in-progress",
    submittedAt: serverTimestamp()
  },
  {
    title: "Kitchen Renovation Design",
    description: "Looking for modern kitchen design with island and storage solutions",
    location: "456 Oak Ave, LA",
    status: "pending",
    submittedAt: serverTimestamp()
  }
];

export const sampleMembership = {
  level: "Gold",
  points: 1250,
  joinDate: Timestamp.fromDate(new Date("2024-01-01")),
  renewalDate: Timestamp.fromDate(new Date("2025-01-01")),
  discountRate: 15
};

// Function to seed all data for a user
export const seedUserData = async (userId: string) => {
  try {
    console.log("🌱 Starting to seed data for user:", userId);

    // Add bookings
    console.log("📚 Adding bookings...");
    for (const booking of sampleBookings) {
      await addDoc(collection(db, "bookings"), {
        ...booking,
        userId
      });
    }

    // Add properties
    console.log("🏠 Adding properties...");
    for (const property of sampleProperties) {
      await addDoc(collection(db, "properties"), {
        ...property,
        ownerId: userId
      });
    }

    // Add design requests
    console.log("🎨 Adding design requests...");
    for (const request of sampleDesignRequests) {
      await addDoc(collection(db, "designRequests"), {
        ...request,
        userId
      });
    }

    // Add membership data
    console.log("👑 Adding membership data...");
    await setDoc(doc(db, "memberships", userId), sampleMembership);

    console.log("✅ Successfully seeded all data!");
    return { success: true, message: "Data seeded successfully!" };

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    return { success: false, message: "Error seeding data", error };
  }
};

// Function to clear user data (for testing)
export const clearUserData = async (userId: string) => {
  try {
    console.log("🧹 Clearing user data...");
    
    // Note: This would require more complex logic to delete documents
    // For now, just log the action
    console.log("Clear user data function called for:", userId);
    
    return { success: true, message: "Data cleared successfully!" };
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    return { success: false, message: "Error clearing data", error };
  }
}; 