// Environment Variables Configuration
// This file centralizes all environment variable access

export const ENV = {

  // Application Settings
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || 'Sisterhood Style Rentals',
    URL: import.meta.env.VITE_APP_URL || 'http://localhost:8081',
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  },

  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  },

  // External Services
  SERVICES: {
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
    STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  },

  // Email Service
  EMAIL: {
    SERVICE_ID: import.meta.env.VITE_EMAIL_SERVICE_ID,
    TEMPLATE_ID: import.meta.env.VITE_EMAIL_TEMPLATE_ID,
    PUBLIC_KEY: import.meta.env.VITE_EMAIL_PUBLIC_KEY,
  },

  // Social Media
  SOCIAL: {
    FACEBOOK_URL: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com/propsisters',
    INSTAGRAM_URL: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/propsisters',
    TWITTER_URL: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com/propsisters',
    WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '+201000474991',
  },

  // Contact Information
  CONTACT: {
    EMAIL: import.meta.env.VITE_CONTACT_EMAIL || 'info@propsisters.eg',
    PHONE: import.meta.env.VITE_CONTACT_PHONE || '+201000474991',
    SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'support@propsisters.eg',
  },

  // Feature Flags
  FEATURES: {
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    CHAT_SUPPORT: import.meta.env.VITE_ENABLE_CHAT_SUPPORT === 'true',
    NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
    BOOKING: import.meta.env.VITE_ENABLE_BOOKING === 'true',
  },
} as const;

// Log environment configuration for debugging
console.log('🔗 Environment Configuration:');
console.log('  - APP.URL:', ENV.APP.URL);
console.log('  - API.BASE_URL:', ENV.API.BASE_URL);
console.log('  - NODE_ENV:', ENV.APP.NODE_ENV);

// Validation function for required environment variables
export const validateEnv = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  if (ENV.APP.DEBUG_MODE) {
    console.log('✅ Environment variables validated successfully');
    console.log('🔧 Current environment:', ENV.APP.NODE_ENV);
  }
};

// Helper function to check if we're in development
export const isDevelopment = () => ENV.APP.NODE_ENV === 'development';

// Helper function to check if we're in production
export const isProduction = () => ENV.APP.NODE_ENV === 'production';


export default ENV;