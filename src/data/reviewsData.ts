// Sample review data for properties
export interface Review {
  id: number;
  propertyId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  response?: {
    from: string;
    date: string;
    comment: string;
  };
}

export const reviews: Review[] = [
  {
    id: 1,
    propertyId: 1,
    userId: 101,
    userName: "Sarah Johnson",
    userAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    date: "2025-04-15",
    title: "Absolutely stunning property!",
    comment: "We had the most amazing stay at this beautiful apartment. The location is perfect - close to all the attractions but still quiet and peaceful. The interior design is gorgeous and the amenities are top-notch. The host was incredibly responsive and helpful throughout our stay. Would definitely recommend!",
    helpful: 24,
    response: {
      from: "Property Manager",
      date: "2025-04-16",
      comment: "Thank you so much for your kind words, Sarah! We're thrilled that you enjoyed your stay and appreciated the design touches. We'd love to welcome you back anytime!"
    }
  },
  {
    id: 2,
    propertyId: 1,
    userId: 102,
    userName: "Michael Chen",
    userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 4,
    date: "2025-03-28",
    title: "Great place, minor issues",
    comment: "The apartment is beautifully designed and very comfortable. The location is convenient with lots of restaurants and shops nearby. Only reason for 4 stars instead of 5 is that the hot water was a bit inconsistent and the wifi was slow at times. Otherwise, a great stay!",
    helpful: 15
  },
  {
    id: 3,
    propertyId: 2,
    userId: 103,
    userName: "Emma Wilson",
    userAvatar: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    date: "2025-04-02",
    title: "Perfect family getaway",
    comment: "This villa exceeded our expectations! Plenty of space for our family of 5, and the kids loved the pool. The kitchen was well-equipped for cooking meals, and the outdoor dining area was perfect for family dinners. The property manager was very attentive and helped us arrange local activities. We're already planning our return trip!",
    helpful: 32,
    response: {
      from: "Property Manager",
      date: "2025-04-03",
      comment: "Thank you for your wonderful review, Emma! We're so happy your family enjoyed the villa and the amenities. We look forward to hosting you again soon!"
    }
  },
  {
    id: 4,
    propertyId: 2,
    userId: 104,
    userName: "David Garcia",
    userAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 4,
    date: "2025-03-15",
    title: "Beautiful property with great views",
    comment: "We had a wonderful stay at this villa. The views are spectacular and the property is very well maintained. The only reason I'm not giving 5 stars is because the air conditioning in one bedroom wasn't working properly, but the property manager was quick to provide fans as a temporary solution.",
    helpful: 18
  },
  {
    id: 5,
    propertyId: 3,
    userId: 105,
    userName: "Jessica Brown",
    userAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 5,
    date: "2025-04-10",
    title: "Stylish apartment in a perfect location",
    comment: "This apartment is even better than the photos! The interior design is stunning and everything is high quality. The location couldn't be better - walking distance to all the major attractions. The host provided excellent recommendations for local restaurants and was very responsive to all our questions. Definitely a 5-star experience!",
    helpful: 27
  },
  {
    id: 6,
    propertyId: 3,
    userId: 106,
    userName: "Robert Kim",
    userAvatar: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 3,
    date: "2025-03-22",
    title: "Nice place but noisy",
    comment: "The apartment itself is beautiful and well-designed. However, it was quite noisy at night due to a nearby restaurant. If you're a light sleeper, this might not be the best choice. The host was responsive and apologetic about the noise issue.",
    helpful: 21,
    response: {
      from: "Property Manager",
      date: "2025-03-23",
      comment: "Thank you for your feedback, Robert. We apologize for the noise disturbance you experienced. We're working with the building management to address this issue. We appreciate your understanding and hope to have the opportunity to host you again in one of our quieter properties."
    }
  },
  {
    id: 7,
    propertyId: 4,
    userId: 107,
    userName: "Olivia Taylor",
    userAvatar: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 5,
    date: "2025-04-05",
    title: "Perfect romantic getaway",
    comment: "My husband and I stayed here for our anniversary and it was absolutely perfect! The apartment is beautifully decorated and has everything you need. The location is ideal for exploring the city on foot. The host even left us a bottle of champagne to celebrate our anniversary - such a thoughtful touch! We'll definitely be back.",
    helpful: 19
  },
  {
    id: 8,
    propertyId: 4,
    userId: 108,
    userName: "James Wilson",
    userAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
    rating: 4,
    date: "2025-03-18",
    title: "Great apartment, minor maintenance issues",
    comment: "This is a lovely apartment in a great location. The only issues we had were a leaky faucet in the bathroom and a few light bulbs that needed replacing. The host was responsive and sent someone to fix these issues promptly. Overall, a very good experience.",
    helpful: 12
  },
  {
    id: 9,
    propertyId: 5,
    userId: 109,
    userName: "Sophia Martinez",
    userAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
    rating: 5,
    date: "2025-04-12",
    title: "Absolutely stunning property!",
    comment: "This house is even more beautiful in person than in the photos! Every detail has been thoughtfully designed and the quality of everything is top-notch. The outdoor space is perfect for relaxing and enjoying the weather. The host was incredibly helpful and provided excellent recommendations for local activities and restaurants. We can't wait to come back!",
    helpful: 31
  },
  {
    id: 10,
    propertyId: 5,
    userId: 110,
    userName: "Daniel Lee",
    userAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    date: "2025-03-25",
    title: "Perfect family vacation spot",
    comment: "We had an amazing time at this property! The house is spacious, beautifully designed, and has everything you need for a comfortable stay. The location is perfect - quiet but still close to attractions and restaurants. The host was very responsive and helpful throughout our stay. Highly recommend!",
    helpful: 24
  }
];

// Function to get reviews for a specific property
export const getReviewsByPropertyId = (propertyId: number): Review[] => {
  return reviews.filter(review => review.propertyId === propertyId);
};

// Function to get average rating for a property
export const getAverageRating = (propertyId: number): number => {
  const propertyReviews = getReviewsByPropertyId(propertyId);
  if (propertyReviews.length === 0) return 0;
  
  const totalRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / propertyReviews.length).toFixed(1));
};

// Function to get rating distribution for a property
export const getRatingDistribution = (propertyId: number): Record<number, number> => {
  const propertyReviews = getReviewsByPropertyId(propertyId);
  const distribution: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  
  propertyReviews.forEach(review => {
    distribution[review.rating]++;
  });
  
  return distribution;
};
