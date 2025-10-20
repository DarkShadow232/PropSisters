// MongoDB Property Service
// Fetches property data from MongoDB via Express API

// IMPORTANT: Make sure admin console is running on port 3000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

export interface MongoProperty {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
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
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';
  if (imagePath.startsWith('http')) return imagePath;
  // If it starts with /uploads, prepend the backend URL
  if (imagePath.startsWith('/uploads')) {
    return `${BASE_URL}${imagePath}`;
  }
  return imagePath;
};

/**
 * Fetch all properties from MongoDB (Simple version)
 */
export const fetchPropertiesFromMongo = async (
  filters?: PropertyFilters
): Promise<PropertyResponse> => {
  try {
    // Simple endpoint - just get all properties
    const url = `${API_BASE_URL}/properties`;
    console.log('Fetching properties from:', url);

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
    // Simple approach: fetch all properties and find the one we need
    const url = `${API_BASE_URL}/properties`;
    console.log('🔍 Fetching property with ID:', propertyId);
    console.log('📡 API URL:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('❌ API Response Error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const properties = await response.json();
    console.log(`✅ Fetched ${properties.length} properties from API`);
    
    // Try to find by multiple ID formats
    const property = properties.find((p: any) => {
      const match = p._id === propertyId || 
                   p.id === propertyId || 
                   p._id.toString() === propertyId ||
                   p.id?.toString() === propertyId;
      if (match) {
        console.log('✅ Found matching property:', p.title);
      }
      return match;
    });
    
    if (!property) {
      console.error('❌ Property not found with ID:', propertyId);
      console.log('Available property IDs:', properties.map((p: any) => ({ _id: p._id, id: p.id })));
    }
    
    return property || null;
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
    reviews: [], // Can be populated from separate collection
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
    googleMapsUrl: '', // Can be generated from address
    coordinates: { latitude: 0, longitude: 0 }, // Can be added to schema if needed
  };
};

