export interface Apartment {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  amenities: string[];
  description: string;
  owner: {
    name: string;
    phone: string;
    email: string;
    responseTime: string;
    rating: number;
  };
  reviews: {
    user: string;
    rating: number;
    comment: string;
  }[];
  housekeepingOptions: {
    service: string;
    price: number;
    description: string;
  }[];
  availability: boolean;
  images?: string[];
}

export const rentals: Apartment[] = [
  {
    id: 1,
    title: "Premium Two-Bedroom Garden View Apartment - Building B6",
    location: "Madinaty, Egypt - Building B6, Group 65, Third Floor",
    price: 120,
    bedrooms: 2,
    bathrooms: 1,
    image: "/image/Apartments/Ap1/IMG-20250327-WA0010.jpg",
    amenities: ["WiFi", "Air Conditioning", "Wide Garden View", "Premium Special Finishes", "Fully Equipped", "Wired Internet", "Facing Services", "Brand New", "Third Floor", "Group 65"],
    description: "موقع متميز جدا - Premium location! This exceptional 2-bedroom, 1-bathroom apartment is located on the third floor (دور ثالث) of Building B6, Group 65 (مجموعة ٦٥). The apartment features a stunning wide garden view (على وايد جاردن) and is strategically positioned directly facing all services (امام الخدمات). This brand new unit (جديدة) boasts special premium finishes (تشطيبات خاصة), complete air conditioning throughout (مكيفة), and comes fully equipped with all necessary appliances (مجهزه بجميع الاجهزه اللازمة). High-speed wired internet (انترنت ارضي) ensures seamless connectivity for modern living.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
      email: "info@propsisters.eg",
      responseTime: "Usually responds within 1 hour",
      rating: 4.9,
    },
    reviews: [
      { user: "Ahmed K.", rating: 5, comment: "Amazing apartment with beautiful garden view! Perfect location near all services." },
      { user: "Layla M.", rating: 5, comment: "Very clean and well-equipped. The premium finishes are excellent." },
      { user: "Omar T.", rating: 4, comment: "Great apartment, Abdullah was very responsive and helpful." },
    ],
    housekeepingOptions: [
      { service: "Basic Cleaning", price: 50, description: "Vacuuming, dusting, bathroom cleaning" },
      { service: "Deep Clean", price: 120, description: "Basic cleaning plus kitchen deep clean, window washing" },
      { service: "Laundry Service", price: 30, description: "Washing and folding of linens and towels" },
    ],
    availability: true,
    images: [
      "/image/Apartments/Ap1/IMG-20250327-WA0003.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0005.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0006.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0007.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0008.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0009.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0010.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0011.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0012.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0013.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0014.jpg",
      "/image/Apartments/Ap1/IMG-20250327-WA0016.jpg"
    ]
  },
  {
    id: 2,
    title: "Modern Two-Bedroom Apartment, Fifth Floor",
    location: "Madinaty, Egypt - Building B11, Group 113",
    price: 140,
    bedrooms: 2,
    bathrooms: 1,
    image: "/image/Apartments/Ap2/IMG-20250327-WA0015.jpg",
    amenities: ["WiFi", "Air Conditioning", "Security Doors", "Near Services", "Fully Equipped", "Internet", "High Floor", "Safe Location"],
    description: "Discover comfort in this modern 2-bedroom apartment on the 5th floor. The unit features full air conditioning and is equipped with all necessary appliances. Security is prioritized with reinforced doors for your peace of mind. Conveniently located directly facing all essential services with wired internet access for seamless connectivity.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
      email: "info@propsisters.eg",
      responseTime: "Usually responds within 2 hours",
      rating: 4.8,
    },
    reviews: [
      { user: "Fahad A.", rating: 5, comment: "Excellent security features and great location. Very comfortable apartment." },
      { user: "Nora S.", rating: 4, comment: "Well-equipped and clean. Mohammed was very helpful throughout." },
      { user: "Khalid R.", rating: 5, comment: "Perfect apartment with all amenities. Highly recommended!" },
    ],
    housekeepingOptions: [
      { service: "Basic Cleaning", price: 45, description: "Vacuuming, dusting, bathroom cleaning" },
      { service: "Deep Clean", price: 100, description: "Basic cleaning plus kitchen deep clean" },
      { service: "Laundry Service", price: 25, description: "Washing and folding of linens and towels" },
    ],
    availability: true,
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
    ]
  },
  {
    id: 3,
    title: "Boho-Style Two-Bedroom Apartment, First Floor",
    location: "Madinaty, Egypt - Building B8, Group 86",
    price: 125,
    bedrooms: 2,
    bathrooms: 1,
    image: "/image/Apartments/Ap3/IMG-20250327-WA0026.jpg",
    amenities: ["WiFi", "Air Conditioning", "Boho Design", "First Floor", "Fully Equipped", "Internet", "Stylish Interior", "Modern Amenities"],
    description: "Step into this uniquely designed 2-bedroom apartment featuring trendy Boho-style interior design. Located on the first floor for easy access, the apartment is fully air-conditioned and equipped with all necessary appliances. The distinctive Boho design creates a warm and artistic atmosphere, perfect for those who appreciate unique and stylish living spaces.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
      email: "info@propsisters.eg",
      responseTime: "Usually responds within 1 hour",
      rating: 4.7,
    },
    reviews: [
      { user: "Maha L.", rating: 5, comment: "Love the Boho design! Very unique and comfortable apartment." },
      { user: "Yousef K.", rating: 4, comment: "Great style and perfect location on first floor. Sara was excellent." },
      { user: "Reem A.", rating: 5, comment: "Beautiful interior design and all amenities work perfectly." },
    ],
    housekeepingOptions: [
      { service: "Basic Cleaning", price: 40, description: "Vacuuming, dusting, bathroom cleaning" },
      { service: "Deep Clean", price: 95, description: "Basic cleaning plus kitchen deep clean" },
      { service: "Interior Maintenance", price: 60, description: "Special care for Boho-style furnishings" },
    ],
    availability: true,
    images: [
      "/image/Apartments/Ap3/IMG-20250327-WA0023.jpg",
      "/image/Apartments/Ap3/IMG-20250327-WA0026.jpg",
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
    ]
  },
  {
    id: 4,
    title: "Spacious Two-Bedroom Ground Floor Apartment",
    location: "Madinaty, Egypt - Building B11, Group 113",
    price: 160,
    bedrooms: 2,
        bathrooms: 2,
    image: "/image/Apartments/Ap4/IMG-20250327-WA0043.jpg",
    amenities: ["WiFi", "Air Conditioning", "Two Bathrooms", "Ground Floor", "Near Strip Mall", "Fully Equipped", "Internet", "Easy Access"],
    description: "Enjoy the convenience of this spacious 2-bedroom, 2-bathroom apartment on the ground floor. Perfect for easy access without stairs, this fully air-conditioned unit is equipped with all necessary appliances. Ideally located directly facing Strip Mall for ultimate shopping and dining convenience, with wired internet for all your connectivity needs.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
      email: "info@propsisters.eg",
      responseTime: "Usually responds within 2 hours",
      rating: 4.6,
    },
    reviews: [
      { user: "Hassan M.", rating: 5, comment: "Perfect location near Strip Mall! Ground floor is very convenient." },
      { user: "Aisha T.", rating: 4, comment: "Spacious apartment with two bathrooms. Turki was very helpful." },
      { user: "Majed S.", rating: 5, comment: "Great for families, easy access and excellent location." },
    ],
    housekeepingOptions: [
      { service: "Basic Cleaning", price: 55, description: "Vacuuming, dusting, two bathroom cleaning" },
      { service: "Deep Clean", price: 130, description: "Comprehensive cleaning of all areas" },
      { service: "Family Package", price: 80, description: "Extended cleaning suitable for families" },
    ],
    availability: true,
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
    ]
  },
  {
    id: 5,
    title: "Convenient First Floor Apartment Near Carrefour",
    location: "Madinaty, Egypt - Building B12, Group 122",
    price: 135,
    bedrooms: 2,
        bathrooms: 1,
    image: "/image/Apartments/Ap5/IMG-20250327-WA0053.jpg",
    amenities: ["WiFi", "Air Conditioning", "Near Carrefour", "First Floor", "Fully Equipped", "Internet", "Shopping Access", "Easy Access"],
    description: "Experience convenience at its finest in this 2-bedroom apartment on the first floor, located right next to Carrefour supermarket. This fully air-conditioned unit comes equipped with all necessary appliances and wired internet. Perfect for those who value easy shopping access and convenient living without the need for elevators.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
      email: "info@propsisters.eg",
      responseTime: "Usually responds within 3 hours",
      rating: 4.5,
    },
    reviews: [
      { user: "Fatima A.", rating: 5, comment: "Perfect location next to Carrefour! Very convenient for shopping." },
      { user: "Saad K.", rating: 4, comment: "Great apartment with easy access. Nasser was responsive and helpful." },
      { user: "Lina M.", rating: 5, comment: "Love the convenience and the apartment is well-maintained." },
    ],
    housekeepingOptions: [
      { service: "Basic Cleaning", price: 45, description: "Vacuuming, dusting, bathroom cleaning" },
      { service: "Deep Clean", price: 105, description: "Basic cleaning plus kitchen deep clean" },
      { service: "Grocery Organization", price: 35, description: "Organization of shopping and pantry areas" },
    ],
    availability: true,
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
    ]
  },
  {
    id: 6,
    title: "Luxury Two-Bedroom Apartment with Two Bathrooms",
    location: "Madinaty, Egypt - Building B6, Group 68",
    price: 180,
    bedrooms: 2,
        bathrooms: 2,
    image: "/image/Apartments/Ap6/IMG-20250327-WA0066.jpg",
    amenities: ["WiFi", "Air Conditioning", "Two Bathrooms", "Second Floor", "Near Services", "Fully Equipped", "Internet", "Premium Location"],
    description: "Indulge in luxury with this premium 2-bedroom, 2-bathroom apartment on the second floor. This fully air-conditioned unit is equipped with all necessary appliances and offers the convenience of two full bathrooms. Located directly facing all services for ultimate convenience, with wired internet connectivity for modern living needs.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
              email: "info@propsisters.eg",
      responseTime: "Usually responds within 1 hour",
      rating: 4.9,
    },
    reviews: [
      { user: "Noura B.", rating: 5, comment: "Luxurious apartment with excellent amenities! Two bathrooms are very convenient." },
      { user: "Abdullah T.", rating: 5, comment: "Perfect location and beautiful apartment. Khalid provided excellent service." },
      { user: "Hala K.", rating: 4, comment: "Very comfortable and well-equipped. Great value for the price." },
    ],
    housekeepingOptions: [
      { service: "Basic Cleaning", price: 60, description: "Vacuuming, dusting, two bathroom cleaning" },
      { service: "Luxury Clean", price: 150, description: "Premium cleaning service for luxury apartment" },
      { service: "Bathroom Specialist", price: 40, description: "Specialized cleaning for both bathrooms" },
    ],
    availability: true,
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
    ]
  },
  {
    id: 7,
    title: "Cozy Studio Apartment, Ground Floor",
    location: "Madinaty, Egypt - Building B6, Group 64",
    price: 90,
    bedrooms: 0,
        bathrooms: 1,
    image: "/image/Apartments/Ap7/IMG-20250327-WA0084.jpg",
    amenities: ["WiFi", "Air Conditioning", "Studio Layout", "Ground Floor", "Fully Equipped", "Internet", "Easy Access", "Compact Living"],
    description: "Perfect for single occupancy or couples, this cozy studio apartment on the ground floor offers comfortable and efficient living. The space includes one bedroom area and one bathroom, fully air-conditioned and equipped with all necessary appliances. Ground floor location provides easy access, with wired internet for all your connectivity needs.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
              email: "info@propsisters.eg",
      responseTime: "Usually responds within 2 hours",
      rating: 4.4,
    },
    reviews: [
      { user: "Rania M.", rating: 4, comment: "Perfect studio for one person. Very cozy and well-equipped." },
      { user: "Faisal A.", rating: 5, comment: "Great value for money! Ahmed was very accommodating." },
      { user: "Leila S.", rating: 4, comment: "Compact but has everything needed. Good location." },
    ],
    housekeepingOptions: [
      { service: "Basic Cleaning", price: 30, description: "Vacuuming, dusting, bathroom cleaning" },
      { service: "Studio Special", price: 50, description: "Complete studio cleaning and organization" },
      { service: "Quick Clean", price: 20, description: "Express cleaning service" },
    ],
    availability: true,
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
    ]
  },
  {
    id: 8,
    title: "Spacious Three-Bedroom Garden View Apartment",
    location: "Madinaty, Egypt - Building B11, Group 111",
    price: 200,
    bedrooms: 3,
        bathrooms: 2,
    image: "/image/Apartments/Ap8/IMG-20250327-WA0098.jpg",
    amenities: ["WiFi", "Air Conditioning", "Three Bedrooms", "Garden View", "Near Carrefour", "Two Bathrooms", "Fourth Floor", "Internet"],
    description: "Experience spacious family living in this exceptional 3-bedroom, 2-bathroom apartment on the fourth floor. Featuring beautiful garden views and full air conditioning throughout, this apartment is perfect for larger families or groups. Located conveniently near Carrefour for easy shopping, with wired internet and all necessary equipment included.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
              email: "info@propsisters.eg",
      responseTime: "Usually responds within 1 hour",
      rating: 4.8,
    },
    reviews: [
      { user: "Mariam K.", rating: 5, comment: "Perfect for our large family! Beautiful garden view and very spacious." },
      { user: "Ibrahim A.", rating: 5, comment: "Excellent apartment with all amenities. Saeed was very professional." },
      { user: "Zaina T.", rating: 4, comment: "Great location near Carrefour and beautiful views. Highly recommended." },
    ],
    housekeepingOptions: [
      { service: "Family Cleaning", price: 80, description: "Comprehensive cleaning for large apartment" },
      { service: "Deep Clean", price: 160, description: "Thorough cleaning of all three bedrooms and bathrooms" },
      { service: "Garden View Special", price: 100, description: "Complete cleaning with window washing for garden views" },
    ],
    availability: true,
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
    ]
  },
  {
    id: 9,
    title: "Premium Two-Bedroom Apartment with Hotel-Style Furnishing",
    location: "Madinaty, Egypt - Building B6, Group 68",
    price: 175,
    bedrooms: 2,
        bathrooms: 2,
    image: "/image/Apartments/Ap9/1.jpg",
    amenities: ["WiFi", "Air Conditioning", "Hotel Furnishing", "Premium Finishes", "Two Bathrooms", "Third Floor", "Fully Equipped", "Internet"],
    description: "Indulge in luxury with this premium 2-bedroom, 2-bathroom apartment featuring hotel-style furnishing on the third floor (90 sqm). This fully equipped unit boasts special premium finishes and complete air conditioning throughout. The hotel-quality furnishing provides an exceptional living experience, while wired internet ensures seamless connectivity for modern living.",
    owner: {
      name: "Property Sisters",
      phone: "+201000474991",
              email: "info@propsisters.eg",
      responseTime: "Usually responds within 1 hour",
      rating: 4.9,
    },
    reviews: [
      { user: "Khalid S.", rating: 5, comment: "Absolutely stunning! The hotel-style furnishing is exceptional." },
      { user: "Nadia L.", rating: 5, comment: "Premium quality throughout. Yasmin provided excellent service." },
      { user: "Mansour A.", rating: 4, comment: "Beautiful apartment with high-end finishes. Very comfortable stay." },
    ],
    housekeepingOptions: [
      { service: "Hotel Standard Clean", price: 70, description: "Professional hotel-standard cleaning service" },
      { service: "Premium Service", price: 140, description: "Luxury cleaning to maintain hotel-quality standards" },
      { service: "VIP Package", price: 120, description: "Complete premium cleaning and maintenance service" },
    ],
    availability: true,
    images: [
      "/image/Apartments/Ap9/1.jpg",
      "/image/Apartments/Ap9/2.jpg",
      "/image/Apartments/Ap9/3.jpg",
      "/image/Apartments/Ap9/4.jpg"
    ]
  }
];
