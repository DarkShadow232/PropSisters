# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
# Start development server
npm run dev
# Server runs on http://localhost:8081

# Build for production
npm run build
# Creates optimized build in dist/ directory

# Build for development (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build locally
npm run preview
```

### Testingz
The project currently doesn't have a dedicated test suite configured. When adding tests, follow the Vite + React testing patterns with tools like Vitest or Jest.

### Database Setup
```bash
# To initialize Firebase Firestore with sample data, navigate to:
# http://localhost:8081/admin/init
# Or run the initialization function programmatically from the admin panel
```

### Quick Deploy (for VPS)
```bash
# Use the provided deployment script
chmod +x deploy.sh
./deploy.sh

# Or run the quick test deployment
chmod +x quick-deploy-test.sh
./quick-deploy-test.sh
```

## Architecture Overview

### Tech Stack
- **Frontend**: Vite + React 18 + TypeScript
- **UI Framework**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API + TanStack Query
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth with Google OAuth
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion + custom Tailwind animations

### Project Structure
```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── auth/         # Authentication components
│   ├── rentals/      # Property rental components
│   ├── reviews/      # Review system components
│   └── ...
├── contexts/         # React contexts (AuthContext)
├── pages/           # Route components
├── lib/             # Utility libraries (firebase, utils)
├── hooks/           # Custom React hooks
├── data/            # Static data and types
└── config/          # Configuration files
```

### Key Features & Architecture Patterns

#### Authentication & Authorization
- **Role-based access**: Three user roles (user, owner, admin)
- **AuthContext**: Centralized authentication state management
- **ProtectedRoute**: Component-level route protection
- **Firestore integration**: User profiles stored in Firebase with role management

#### Data Layer
- **Firebase Firestore**: Main database with collections defined in `src/lib/firestore-collections.ts`
- **Collections**: users, properties, bookings, reviews, design_requests, memberships
- **Static data fallback**: `src/data/rentalData.ts` provides sample properties for development

#### Environment Management
- **Centralized config**: `src/config/env.ts` manages all environment variables
- **Validation**: Automatic environment variable validation on startup
- **Multi-environment**: Support for development, production, and custom environments

#### UI Design System
- **Custom color palette**: rustic, beige, sage, charcoal colors for brand consistency
- **Animation system**: Custom Tailwind animations for smooth interactions
- **Component library**: shadcn/ui with custom extensions
- **Responsive design**: Mobile-first approach with consistent breakpoints

#### Routing Structure
```
/ - HomePage (public)
/rentals - Property listings (public)
/rentals/:id - Property details (public)
/booking/:id - Booking flow (protected: user+)
/dashboard - User dashboard (protected: user+)
/add-property - Add property (protected: owner+)
/admin/init - Database initialization (development only)
```

### Development Patterns

#### Component Organization
- **Feature-based**: Components grouped by functionality (rentals/, reviews/, auth/)
- **UI components**: Reusable components in ui/ directory
- **Page components**: Route-level components in pages/
- **Layout components**: App-level layouts and navigation

#### State Management
- **AuthContext**: Global authentication state
- **TanStack Query**: Server state management for API calls
- **Local state**: useState/useReducer for component-specific state

#### Data Fetching
- **Firebase SDK**: Direct integration with Firestore
- **Real-time updates**: Firestore listeners for live data
- **Static fallbacks**: Development data in `/src/data/`

#### Form Handling
- **React Hook Form**: Form state management
- **Zod validation**: Type-safe form validation
- **Error handling**: Centralized error display with toast notifications

## Environment Setup

### Required Environment Variables
```env
# Firebase (Required)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Application
VITE_APP_NAME="Sisterhood Style Rentals"
VITE_APP_URL=http://localhost:8081
NODE_ENV=development
```

Copy `.env.example` to `.env.local` and fill in the Firebase configuration values.

### Database Collections Schema
- **properties**: Property listings with images, amenities, owner info
- **bookings**: Reservation records with guest details and service add-ons
- **reviews**: Property reviews with ratings and comments
- **users**: User profiles with role-based permissions
- **design_requests**: Interior design service requests
- **memberships**: User membership levels and benefits

## Important Files

### Configuration
- `src/config/env.ts` - Environment variable management
- `vite.config.ts` - Vite configuration with path aliases
- `tailwind.config.ts` - Custom design system and animations
- `tsconfig.json` - TypeScript configuration with path mapping

### Core Logic
- `src/contexts/AuthContext.tsx` - Authentication state and user role management
- `src/lib/firebase.ts` - Firebase initialization and auth functions  
- `src/lib/firestore-collections.ts` - Database schema and interfaces
- `src/data/rentalData.ts` - Sample property data for development

### Key Components
- `src/components/auth/ProtectedRoute.tsx` - Route-level authentication
- `src/components/Layout.tsx` - Main application layout
- `src/App.tsx` - Route configuration and providers

## Development Notes

### Path Aliases
The project uses `@/` as an alias for `src/`. All imports should use this alias for consistency.

### Firebase Integration
- Environment validation ensures required Firebase config is present
- AuthContext automatically creates user profiles in Firestore on first login
- Role-based access control is enforced at both route and component levels

### Custom Animations
The project includes custom Tailwind animations defined in `tailwind.config.ts`. Use these for consistent motion design across the application.

### Mobile-First Development
All components should be developed with mobile-first responsive design principles using Tailwind's responsive utilities.

### Deployment
The project is configured for VPS deployment with Nginx. Use the provided deployment scripts in the root directory for automated deployment workflows.
