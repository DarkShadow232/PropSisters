/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_EMAIL_SERVICE_ID: string
  readonly VITE_EMAIL_TEMPLATE_ID: string
  readonly VITE_EMAIL_PUBLIC_KEY: string
  readonly VITE_FACEBOOK_URL: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_TWITTER_URL: string
  readonly VITE_WHATSAPP_NUMBER: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_CONTACT_PHONE: string
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_CHAT_SUPPORT: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_REVIEWS: string
  readonly VITE_ENABLE_BOOKING: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}