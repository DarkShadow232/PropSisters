import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  serverTimestamp,
  Timestamp,
  writeBatch,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { rentals } from "@/data/rentalData";

// Initialize Firestore with sample data
export const initializeFirestore = async () => {
  try {
    console.log("🚀 بدء تهيئة قاعدة البيانات...");
    
    const batch = writeBatch(db);
    
    // Add properties from rental data
    console.log("🏠 إضافة العقارات...");
    for (const rental of rentals) {
      const propertyRef = doc(collection(db, "properties"));
      batch.set(propertyRef, {
        id: rental.id,
        title: rental.title,
        location: rental.location,
        pricePerNight: rental.price,
        bedrooms: rental.bedrooms,
        bathrooms: rental.bathrooms,
        image: rental.image,
        images: rental.images || [rental.image],
        amenities: rental.amenities,
        description: rental.description,
        availability: rental.availability,
        status: "active",
        averageRating: rental.reviews.reduce((sum, review) => sum + review.rating, 0) / rental.reviews.length,
        reviewsCount: rental.reviews.length,
        views: Math.floor(Math.random() * 200) + 50, // Random views between 50-250
        owner: rental.owner,
        housekeepingOptions: rental.housekeepingOptions,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Add reviews for each property
      for (const review of rental.reviews) {
        const reviewRef = doc(collection(db, "reviews"));
        batch.set(reviewRef, {
          propertyId: rental.id,
          propertyTitle: rental.title,
          user: review.user,
          rating: review.rating,
          comment: review.comment,
          createdAt: serverTimestamp()
        });
      }
    }
    
    // Add sample bookings
    console.log("📅 إضافة الحجوزات النموذجية...");
    const sampleBookings = [
      {
        propertyId: 1,
        propertyTitle: "Premium Two-Bedroom Garden View Apartment - Building B6",
        guestName: "أحمد محمد",
        guestEmail: "ahmed@example.com",
        guestPhone: "+201234567890",
        checkIn: Timestamp.fromDate(new Date("2024-02-15")),
        checkOut: Timestamp.fromDate(new Date("2024-02-20")),
        guests: 2,
        totalPrice: 600,
        status: "confirmed",
        paymentStatus: "paid",
        specialRequests: "Late arrival",
        createdAt: serverTimestamp()
      },
      {
        propertyId: 2,
        propertyTitle: "Modern Two-Bedroom Apartment, Fifth Floor",
        guestName: "فاطمة أحمد",
        guestEmail: "fatima@example.com",
        guestPhone: "+201987654321",
        checkIn: Timestamp.fromDate(new Date("2024-03-10")),
        checkOut: Timestamp.fromDate(new Date("2024-03-15")),
        guests: 3,
        totalPrice: 700,
        status: "pending",
        paymentStatus: "pending",
        specialRequests: "غرفة هادئة",
        createdAt: serverTimestamp()
      },
      {
        propertyId: 3,
        propertyTitle: "Boho-Style Two-Bedroom Apartment, First Floor",
        guestName: "محمد علي",
        guestEmail: "mohammed@example.com",
        guestPhone: "+201555666777",
        checkIn: Timestamp.fromDate(new Date("2024-01-20")),
        checkOut: Timestamp.fromDate(new Date("2024-01-25")),
        guests: 2,
        totalPrice: 625,
        status: "completed",
        paymentStatus: "paid",
        specialRequests: "",
        createdAt: serverTimestamp()
      }
    ];
    
    for (const booking of sampleBookings) {
      const bookingRef = doc(collection(db, "bookings"));
      batch.set(bookingRef, booking);
    }
    
    // Add sample design requests
    console.log("🎨 إضافة طلبات التصميم...");
    const designRequests = [
      {
        title: "تصميم غرفة معيشة عصرية",
        description: "أحتاج مساعدة في تصميم غرفة معيشة بطراز عصري مع لمسة مينيماليست",
        clientName: "سارة أحمد",
        clientEmail: "sara@example.com",
        clientPhone: "+201111222333",
        location: "المدينة الجديدة، القاهرة",
        budget: "15000-25000 جنيه",
        status: "in-progress",
        priority: "medium",
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        title: "تجديد المطبخ",
        description: "أريد تجديد المطبخ بتصميم حديث مع جزيرة وحلول تخزين ذكية",
        clientName: "خالد محمود",
        clientEmail: "khaled@example.com",
        clientPhone: "+201444555666",
        location: "مدينتي، القاهرة الجديدة",
        budget: "30000-50000 جنيه",
        status: "pending",
        priority: "high",
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];
    
    for (const request of designRequests) {
      const requestRef = doc(collection(db, "designRequests"));
      batch.set(requestRef, request);
    }
    
    // Add sample users
    console.log("👥 إضافة المستخدمين النموذجيين...");
    const sampleUsers = [
      {
        uid: "user1",
        email: "ahmed@example.com",
        displayName: "أحمد محمد",
        phone: "+201234567890",
        role: "guest",
        membershipLevel: "bronze",
        points: 150,
        joinDate: serverTimestamp(),
        lastLogin: serverTimestamp()
      },
      {
        uid: "user2",
        email: "fatima@example.com",
        displayName: "فاطمة أحمد",
        phone: "+201987654321",
        role: "guest",
        membershipLevel: "silver",
        points: 750,
        joinDate: serverTimestamp(),
        lastLogin: serverTimestamp()
      }
    ];
    
    for (const user of sampleUsers) {
      const userRef = doc(db, "users", user.uid);
      batch.set(userRef, user);
    }
    
    // Add app settings
    console.log("⚙️ إضافة إعدادات التطبيق...");
    const appSettingsRef = doc(db, "settings", "app");
    batch.set(appSettingsRef, {
      siteName: "Sisterhood Style Rentals",
      contactEmail: "info@propsisters.eg",
      contactPhone: "+201000474991",
      address: "مدينتي، القاهرة الجديدة، مصر",
      currency: "EGP",
      taxRate: 0.14, // 14% VAT in Egypt
      bookingSettings: {
        minBookingDays: 1,
        maxBookingDays: 30,
        advanceBookingDays: 365,
        cancellationPolicy: "flexible"
      },
      paymentMethods: ["cash", "bank_transfer", "credit_card"],
      languages: ["ar", "en"],
      defaultLanguage: "ar",
      maintenanceMode: false,
      updatedAt: serverTimestamp()
    });
    
    // Commit all changes
    await batch.commit();
    
    console.log("✅ تم تهيئة قاعدة البيانات بنجاح!");
    return { success: true, message: "تم تهيئة قاعدة البيانات بنجاح!" };
    
  } catch (error) {
    console.error("❌ خطأ في تهيئة قاعدة البيانات:", error);
    return { success: false, message: "خطأ في تهيئة قاعدة البيانات", error };
  }
};

// Function to check if database is empty
export const isDatabaseEmpty = async (): Promise<boolean> => {
  try {
    const collections = ['properties', 'bookings', 'users', 'reviews'];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      if (!snapshot.empty) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking database:", error);
    return false;
  }
};

// Function to reset database (use with caution)
export const resetDatabase = async () => {
  try {
    console.log("🗑️ بدء إعادة تعيين قاعدة البيانات...");
    
    // Note: This is a simplified version
    // In production, you'd need to implement proper deletion logic
    console.log("⚠️ تحذير: إعادة تعيين قاعدة البيانات تتطلب تنفيذ يدوي");
    
    return { success: true, message: "تم التحذير من إعادة التعيين" };
  } catch (error) {
    console.error("❌ خطأ في إعادة تعيين قاعدة البيانات:", error);
    return { success: false, message: "خطأ في إعادة التعيين", error };
  }
};