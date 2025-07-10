import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initAllAnimations } from "./utils/animations";
import { AuthProvider } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RentalsPage from "./pages/RentalsPage";
import BookingPage from "./pages/BookingPage";
import RentalDetailsPage from "./pages/RentalDetailsPage";
import FinishRequestPage from "./pages/FinishRequestPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import PropertySistersClubPage from "./pages/PropertySistersClubPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize animations when the app loads
  useEffect(() => {
    const cleanup = initAllAnimations();
    return cleanup;
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="rentals" element={<RentalsPage />} />
              <Route path="rentals/:id" element={<RentalDetailsPage />} />
              <Route path="booking/:id" element={
                <ProtectedRoute requiredRole="user">
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="finish-request" element={
                <ProtectedRoute requiredRole="user">
                  <FinishRequestPage />
                </ProtectedRoute>
              } />
              <Route path="services" element={<ServicesPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-up" element={<SignUpPage />} />
              <Route path="add-property" element={
                <ProtectedRoute requiredRole="owner">
                  <AddPropertyPage />
                </ProtectedRoute>
              } />
              <Route path="property-sisters-club" element={
                <ProtectedRoute requiredRole="user">
                  <PropertySistersClubPage />
                </ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
