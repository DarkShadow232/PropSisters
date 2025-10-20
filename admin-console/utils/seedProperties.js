const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to load .env file if it exists
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('⚠️  No .env file found, using default MongoDB connection');
}

const Rental = require('../models/Rental');

// The 9 original properties from the frontend
const originalProperties = [
  {
    title: "Premium Two-Bedroom Garden View Apartment - Building B6",
    description: "Premium location! This exceptional 2-bedroom, 1-bathroom apartment is located on the third floor of Building B6, Group 65. The apartment features a stunning wide garden view and is strategically positioned directly facing all services. This brand new unit boasts special premium finishes, complete air conditioning throughout, and comes fully equipped with all necessary appliances. High-speed wired internet ensures seamless connectivity for modern living.",
    location: "Madinaty, Egypt - Building B6, Group 65, Third Floor",
    address: "Building B6, Group 65, Madinaty, New Cairo, Egypt",
    price: 3000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Air Conditioning", "Wide Garden View", "Premium Special Finishes", "Fully Equipped", "Wired Internet", "Facing Services", "Brand New", "Third Floor", "Group 65"],
    images: [
      "/image/Apartments/Ap1/IMG-20250327-WA0010.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0003.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0005.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0006.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0007.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0008.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0009.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0011.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0012.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0013.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0014.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0016.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Modern Two-Bedroom Apartment, Fifth Floor",
    description: "Discover comfort in this modern 2-bedroom apartment on the 5th floor. The unit features full air conditioning and is equipped with all necessary appliances. Security is prioritized with reinforced doors for your peace of mind. Conveniently located directly facing all essential services with wired internet access for seamless connectivity.",
    location: "Madinaty, Egypt - Building B11, Group 113",
    address: "Building B11, Group 113, Madinaty, New Cairo, Egypt",
    price: 3000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Air Conditioning", "Security Doors", "Near Services", "Fully Equipped", "Internet", "High Floor", "Safe Location"],
    images: [
      "/image/Apartments/Ap2/IMG-20250327-WA0015.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0017.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0018.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0019.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0020.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0021.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0022.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0024.jpg",
      "/image/Apartments/Ap2/IMG-20250327-WA0025.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Boho-Style Two-Bedroom Apartment, First Floor",
    description: "Step into this uniquely designed 2-bedroom apartment featuring trendy Boho-style interior design. Located on the first floor for easy access, the apartment is fully air-conditioned and equipped with all necessary appliances. The distinctive Boho design creates a warm and artistic atmosphere, perfect for those who appreciate unique and stylish living spaces.",
    location: "Madinaty, Egypt - Building B8, Group 86",
    address: "Building B8, Group 86, Madinaty, New Cairo, Egypt",
    price: 3000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Air Conditioning", "Boho Design", "First Floor", "Fully Equipped", "Internet", "Stylish Interior", "Modern Amenities"],
    images: [
      "/image/Apartments/Ap3/IMG-20250327-WA0026.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0023.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0027.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0028.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0029.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0030.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0031.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0032.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0033.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0034.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0035.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0036.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0037.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Spacious Two-Bedroom Ground Floor Apartment",
    description: "Enjoy the convenience of this spacious 2-bedroom, 2-bathroom apartment on the ground floor. Perfect for easy access without stairs, this fully air-conditioned unit is equipped with all necessary appliances. Ideally located directly facing Strip Mall for ultimate shopping and dining convenience, with wired internet for all your connectivity needs.",
    location: "Madinaty, Egypt - Building B11, Group 113",
    address: "Building B11, Group 113, Madinaty, New Cairo, Egypt",
    price: 3000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Air Conditioning", "Two Bathrooms", "Ground Floor", "Near Strip Mall", "Fully Equipped", "Internet", "Easy Access"],
    images: [
      "/image/Apartments/Ap4/IMG-20250327-WA0043.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0044.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0045.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0046.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0047.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0048.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0049.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0050.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0051.jpg",
      "/image/Apartments/Ap4/IMG-20250327-WA0052.jpg",
      "/image/Apartments/Ap4/WhatsApp Image 2025-03-26 at 09.48.48_6b341294.jpg",
      "/image/Apartments/Ap4/WhatsApp Image 2025-03-26 at 09.48.48_d73a8288.jpg",
      "/image/Apartments/Ap4/WhatsApp Image 2025-03-26 at 09.48.48_e6dc9f4f.jpg",
      "/image/Apartments/Ap4/WhatsApp Image 2025-03-26 at 09.48.49_d361c165.jpg",
      "/image/Apartments/Ap4/WhatsApp Image 2025-03-26 at 09.48.49_d96e4dfe.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Convenient First Floor Apartment Near Carrefour",
    description: "Experience convenience at its finest in this 2-bedroom apartment on the first floor, located right next to Carrefour supermarket. This fully air-conditioned unit comes equipped with all necessary appliances and wired internet. Perfect for those who value easy shopping access and convenient living without the need for elevators.",
    location: "Madinaty, Egypt - Building B12, Group 122",
    address: "Near Carrefour, Madinaty, New Cairo, Egypt",
    price: 3000,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["WiFi", "Air Conditioning", "Near Carrefour", "First Floor", "Fully Equipped", "Internet", "Shopping Access", "Easy Access"],
    images: [
      "/image/Apartments/Ap5/IMG-20250327-WA0053.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0054.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0055.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0056.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0057.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0058.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0059.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0060.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0061.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0062.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0063.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0064.jpg",
      "/image/Apartments/Ap5/IMG-20250327-WA0065.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Luxury Two-Bedroom Apartment with Two Bathrooms",
    description: "Indulge in luxury with this premium 2-bedroom, 2-bathroom apartment on the second floor. This fully air-conditioned unit is equipped with all necessary appliances and offers the convenience of two full bathrooms. Located directly facing all services for ultimate convenience, with wired internet connectivity for modern living needs.",
    location: "Madinaty, Egypt - Building B6, Group 68",
    address: "Building B6, Group 68, Madinaty, New Cairo, Egypt",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Air Conditioning", "Two Bathrooms", "Second Floor", "Near Services", "Fully Equipped", "Internet", "Premium Location"],
    images: [
      "/image/Apartments/Ap6/IMG-20250327-WA0066.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0067.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0068.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0069.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0070.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0071.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0072.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0073.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0074.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0075.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0076.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0077.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0078.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0079.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0080.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0081.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0082.jpg",
      "/image/Apartments/Ap6/IMG-20250327-WA0085.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Cozy Studio Apartment, Ground Floor",
    description: "Perfect for single occupancy or couples, this cozy studio apartment on the ground floor offers comfortable and efficient living. The space includes one bedroom area and one bathroom, fully air-conditioned and equipped with all necessary appliances. Ground floor location provides easy access, with wired internet for all your connectivity needs.",
    location: "Madinaty, Egypt - Building B6, Group 64",
    address: "Building B6, Group 64, Madinaty, New Cairo, Egypt",
    price: 2500,
    bedrooms: 0,
    bathrooms: 1,
    amenities: ["WiFi", "Air Conditioning", "Studio Layout", "Ground Floor", "Fully Equipped", "Internet", "Easy Access", "Compact Living"],
    images: [
      "/image/Apartments/Ap7/IMG-20250327-WA0084.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0086.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0087.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0088.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0089.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0090.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0091.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0092.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0093.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0094.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0095.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0096.jpg",
      "/image/Apartments/Ap7/IMG-20250327-WA0097.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Spacious Three-Bedroom Garden View Apartment",
    description: "Experience spacious family living in this exceptional 3-bedroom, 2-bathroom apartment on the fourth floor. Featuring beautiful garden views and full air conditioning throughout, this apartment is perfect for larger families or groups. Located conveniently near Carrefour for easy shopping, with wired internet and all necessary equipment included.",
    location: "Madinaty, Egypt - Building B11, Group 111",
    address: "Building B11, Group 111, Madinaty, New Cairo, Egypt",
    price: 2500,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["WiFi", "Air Conditioning", "Three Bedrooms", "Garden View", "Near Carrefour", "Two Bathrooms", "Fourth Floor", "Internet"],
    images: [
      "/image/Apartments/Ap8/IMG-20250327-WA0098.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0099.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0100.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0101.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0102.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0103.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0104.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0105.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0106.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0107.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0108.jpg",
      "/image/Apartments/Ap8/IMG-20250327-WA0109.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  },
  {
    title: "Premium Two-Bedroom Apartment with Hotel-Style Furnishing",
    description: "Indulge in luxury with this premium 2-bedroom, 2-bathroom apartment featuring hotel-style furnishing on the third floor (90 sqm). This fully equipped unit boasts special premium finishes and complete air conditioning throughout. The hotel-quality furnishing provides an exceptional living experience, while wired internet ensures seamless connectivity for modern living.",
    location: "Madinaty, Egypt - Building B6, Group 68",
    address: "Building B6, Group 68, Madinaty, New Cairo, Egypt",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Air Conditioning", "Hotel Furnishing", "Premium Finishes", "Two Bathrooms", "Third Floor", "Fully Equipped", "Internet"],
    images: [
      "/image/Apartments/Ap9/1.jpg",
      "/image/Apartments/Ap9/2.jpg",
      "/image/Apartments/Ap9/3.jpg",
      "/image/Apartments/Ap9/4.jpg"
    ],
    ownerName: "Property Sisters",
    ownerEmail: "info@propsisters.eg",
    ownerPhone: "+201000474991",
    availability: true
  }
];

// Test property to verify the connection
const testProperty = {
  title: "TEST PROPERTY - Verify Admin Connection",
  description: "This is a test property created to verify that properties added through the admin console appear on the frontend immediately. If you can see this property, the connection is working perfectly!",
  location: "Test Location - Madinaty, Egypt",
  address: "Test Address, Madinaty, New Cairo, Egypt",
  price: 1000,
  bedrooms: 1,
  bathrooms: 1,
  amenities: ["Test Amenity", "WiFi", "Air Conditioning"],
  images: ["/placeholder.svg"],
  ownerName: "Property Sisters",
  ownerEmail: "info@propsisters.eg",
  ownerPhone: "+201000474991",
  availability: true
};

async function seedProperties() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB successfully!');

    // Check if properties already exist
    const existingCount = await Rental.countDocuments();
    console.log(`Found ${existingCount} existing properties in database`);

    if (existingCount > 0) {
      console.log('\n⚠️  Database already contains properties!');
      console.log('Do you want to:');
      console.log('1. Keep existing and add new ones');
      console.log('2. Clear all and start fresh');
      console.log('\nTo clear all properties, run: node utils/clearProperties.js');
      console.log('Then run this script again.');
      console.log('\nProceeding to add properties (keeping existing ones)...\n');
    }

    // Insert the 9 original properties
    console.log('Inserting 9 original properties...');
    const insertedProperties = await Rental.insertMany(originalProperties);
    console.log(`✓ Successfully added ${insertedProperties.length} original properties`);

    // Insert test property
    console.log('\nInserting test property...');
    const testPropertyResult = await Rental.create(testProperty);
    console.log(`✓ Successfully added test property (ID: ${testPropertyResult._id})`);

    // Display summary
    const finalCount = await Rental.countDocuments();
    console.log('\n' + '='.repeat(60));
    console.log('SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`Total properties in database: ${finalCount}`);
    console.log('\nThe following properties were added:');
    
    originalProperties.forEach((prop, index) => {
      console.log(`  ${index + 1}. ${prop.title}`);
    });
    console.log(`  10. ${testProperty.title}`);

    console.log('\n' + '='.repeat(60));
    console.log('NEXT STEPS:');
    console.log('='.repeat(60));
    console.log('1. Make sure the admin console is running:');
    console.log('   cd admin-console && npm start');
    console.log('');
    console.log('2. Make sure the frontend is running:');
    console.log('   npm run dev');
    console.log('');
    console.log('3. Visit http://localhost:5173/rentals to see the properties');
    console.log('');
    console.log('4. Visit http://localhost:3000 to manage properties in admin console');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the seeding function
seedProperties();

