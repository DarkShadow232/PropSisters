// MongoDB Property Service
// Fetches property data from MongoDB via Express API

// IMPORTANT: Make sure admin console is running on port 3000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.propsiss.com/api';
// Remove /api from the end, being careful to preserve the protocol slashes
const BASE_URL = API_BASE_URL.endsWith('/api') 
  ? API_BASE_URL.slice(0, -4) 
  : API_BASE_URL;

// Log the base URLs for debugging
console.log('🔗 MongoPropertyService: API_BASE_URL:', API_BASE_URL);
console.log('🔗 MongoPropertyService: BASE_URL:', BASE_URL);

export interface MongoProperty {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  googleMapsUrl?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
}

export interface PropertyResponse {
  success: boolean;
  data: MongoProperty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Get image URL with proper base path
 * - Static images (Ap1, Ap2, etc.) are bundled with frontend
 * - Uploaded images (property-*.jpg) are served from admin backend
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    console.log('🖼️ Image URL: empty path → placeholder');
    return '/placeholder.svg';
  }
  
  if (imagePath.startsWith('http')) {
    console.log('🖼️ Image URL: absolute URL →', imagePath);
    return imagePath;
  }
  
  // Check if it's an uploaded property image (property-timestamp-random.ext)
  // Handles both new path (/image/Apartments/property-*) and old path (/uploads/rentals/property-*)
  if (imagePath.includes('property-') && (imagePath.includes('/uploads/') || imagePath.includes('/image/Apartments/'))) {
    const fullUrl = `${BASE_URL}${imagePath}`;
    console.log('🖼️ Image URL: uploaded property →', imagePath, '→', fullUrl);
    return fullUrl;
  }
  
  // Otherwise it's a static bundled image, return as-is (served by frontend)
  console.log('🖼️ Image URL: static bundled →', imagePath);
  return imagePath;
};

/**
 * Fetch all properties from MongoDB (Simple version)
 */
export const fetchPropertiesFromMongo = async (
  filters?: PropertyFilters
): Promise<PropertyResponse> => {
  try {
    // Build query parameters from filters
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters?.bedrooms) queryParams.append('bedrooms', filters.bedrooms.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    
    const url = `${API_BASE_URL}/properties${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('Fetching properties from:', url);
    console.log('Filters applied:', filters);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // The simple endpoint returns an array directly
    const properties = await response.json();
    
    // Return in expected format
    return {
      success: true,
      data: Array.isArray(properties) ? properties : [],
      pagination: {
        page: 1,
        limit: properties.length,
        total: properties.length,
        pages: 1
      }
    };
  } catch (error) {
    console.error('Error fetching properties from MongoDB:', error);
    throw error;
  }
};

/**
 * Fetch single property by ID from MongoDB (Simple version)
 */
export const fetchPropertyByIdFromMongo = async (
  propertyId: string
): Promise<MongoProperty | null> => {
  try {
    // Use the specific endpoint for fetching a single property
    const url = `${API_BASE_URL}/properties/public/${propertyId}`;
    console.log('🔍 Fetching property with ID:', propertyId);
    console.log('📡 API URL:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('❌ API Response Error:', response.status, response.statusText);
      if (response.status === 404) {
        console.error('❌ Property not found with ID:', propertyId);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('✅ API Response:', responseData);
    
    // Handle the wrapped response format
    if (responseData.success && responseData.data) {
      console.log('✅ Property fetched successfully:', responseData.data.title);
      return responseData.data;
    } else {
      console.error('❌ Invalid response format:', responseData);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching property from MongoDB:', error);
    throw error;
  }
};

/**
 * Convert MongoDB property to frontend Apartment format
 * This maintains compatibility with existing frontend components
 */
export const convertMongoToApartment = (mongoProp: MongoProperty): any => {
  const propertyId = mongoProp._id || mongoProp.id;
  console.log('🔄 Converting MongoDB property to Apartment format:', {
    _id: mongoProp._id,
    id: mongoProp.id,
    finalId: propertyId,
    title: mongoProp.title
  });
  
  return {
    id: propertyId,
    _id: mongoProp._id, // Keep MongoDB _id for reference
    title: mongoProp.title,
    location: mongoProp.location,
    price: mongoProp.price,
    bedrooms: mongoProp.bedrooms,
    bathrooms: mongoProp.bathrooms,
    image: getImageUrl(mongoProp.images?.[0] || ''),
    images: mongoProp.images?.map(getImageUrl) || [],
    amenities: mongoProp.amenities || [],
    description: mongoProp.description,
    availability: mongoProp.availability,
    address: mongoProp.address,
    owner: {
      name: mongoProp.ownerName || 'Property Sisters',
      phone: mongoProp.ownerPhone || '+201000474991',
      email: mongoProp.ownerEmail || 'info@propsisters.eg',
      responseTime: 'Usually responds within 1 hour',
      rating: 4.8,
    },
    reviews: [
      {
        user: "Sarah M.",
        rating: 5,
        comment: "Amazing property with excellent location and beautiful interior design!"
      },
      {
        user: "Ahmed K.",
        rating: 4,
        comment: "Great stay, very clean and well-maintained. Highly recommended!"
      },
      {
        user: "Emma L.",
        rating: 5,
        comment: "Perfect for our family vacation. The host was very responsive and helpful."
      }
    ], // Can be populated from separate collection
    housekeepingOptions: [
      { 
        service: 'Basic Cleaning', 
        price: 2000, 
        description: 'Vacuuming, dusting, bathroom cleaning' 
      },
      { 
        service: 'Deep Clean', 
        price: 5000, 
        description: 'Basic cleaning plus kitchen deep clean, window washing' 
      },
      { 
        service: 'Laundry Service', 
        price: 1500, 
        description: 'Washing and folding of linens and towels' 
      },
    ],
    googleAddress: mongoProp.address,
    googleMapsUrl: mongoProp.googleMapsUrl || '',
    coordinates: { latitude: 0, longitude: 0 }, // Can be added to schema if needed
  };
};

