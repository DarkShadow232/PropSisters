import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar as CalendarIcon, CreditCard, Check, Clock, User, Building, Landmark, Shield, AlertCircle, BanknoteIcon } from "lucide-react";
import { rentals } from "@/data/rentalData";
import { Apartment } from "@/data/rentalData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import bookingService from "@/services/bookingService";
import { processPayment, PaymentRequest } from "@/services/paymentService";
import PaymentGatewaySelector from "@/components/PaymentGatewaySelector";
import { fetchPropertyByIdFromMongo, convertMongoToApartment } from "@/services/mongoPropertyService";

// Removed PayPalIcon component - now handled by PaymentGatewaySelector

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rental, setRental] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    cleaningService: false,
    airportPickup: false,
    earlyCheckIn: false,
    paymentMethod: "paymob", // Default to Egyptian gateway
    paymentSubMethod: "", // For mobile wallets, etc.
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    billingAddress: "",
    billingCity: "",
    billingZip: "",
    billingCountry: "Egypt",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    accountNumber: "",
    routingNumber: ""
  });
  
  // Fetch the rental by ID from MongoDB
  useEffect(() => {
    const fetchRental = async () => {
      if (!id) {
        console.log('⚠️ No ID provided');
        return;
      }
      
      console.log('🏠 Fetching rental details for booking ID:', id);
      
      try {
        setLoading(true);
        setError(null);
        const mongoProperty = await fetchPropertyByIdFromMongo(id);
        
        if (mongoProperty) {
          console.log('✅ Property loaded successfully for booking:', mongoProperty.title);
          const apartment = convertMongoToApartment(mongoProperty);
          setRental(apartment);
        } else {
          console.error('❌ Property not found for ID:', id);
          setError("Property not found");
        }
      } catch (err) {
        console.error("❌ Error fetching property:", err);
        setError("Failed to load property details. Please make sure the admin console is running.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRental();
  }, [id]);
  
  // Calculate total nights
  const calculateNights = () => {
    if (selectedDates.from && selectedDates.to) {
      const diffTime = Math.abs(selectedDates.to.getTime() - selectedDates.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };
  
  // Calculate total price
  const calculateTotal = () => {
    const nights = calculateNights();
    let total = rental ? rental.price * nights : 0;
    
    // Add extras
    if (formData.cleaningService) total += 50;
    if (formData.airportPickup) total += 35;
    if (formData.earlyCheckIn) total += 25;
    
    return total;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Validation functions for Egyptian payment gateways
  const isValidEgyptianPhone = (phone: string) => {
    // Egyptian mobile numbers: +20 followed by 10 digits
    const cleaned = phone.replace(/[^\d]/g, '');
    return cleaned.length === 13 && cleaned.startsWith('20') && /^20(10|11|12|15)\d{8}$/.test(cleaned);
  };

  const isValidEgyptianNationalId = (id: string) => {
    // Egyptian National ID: 14 digits
    return id.length === 14 && /^\d{14}$/.test(id);
  };

  // Validate payment information before submission
  const validatePaymentInfo = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Basic validation for all payment methods
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    // Validate phone number for mobile wallet payments
    if (['vodafone-cash', 'orange-money', 'etisalat-cash'].includes(formData.paymentSubMethod)) {
      if (!formData.phone || !isValidEgyptianPhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid Egyptian mobile number (+20xxxxxxxxxx)';
      }
    }
    
    // Validate required guest information
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Validate payment information
    if (!validatePaymentInfo()) {
      return;
    }
    
    // Validate dates are selected
    if (!selectedDates.from || !selectedDates.to) {
      toast({
        title: "Invalid Dates",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Note: Availability is already checked in the calendar on the property details page
      // The calendar shows real booking data and prevents selection of booked dates
      
      // Process payment first
      const paymentRequest: PaymentRequest = {
        amount: calculateTotal(),
        currency: 'EGP',
        gateway: formData.paymentMethod,
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        bookingInfo: {
          propertyId: rental.id.toString(),
          checkIn: selectedDates.from,
          checkOut: selectedDates.to,
          nights: calculateNights()
        },
        paymentMethod: formData.paymentSubMethod
      };
      
      const paymentResult = await processPayment(paymentRequest);
      
      if (!paymentResult.success) {
        toast({
          title: "Payment Failed",
          description: paymentResult.error || "Payment processing failed. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // If payment requires redirect (like Paymob, Fawry), redirect user
      if (paymentResult.redirectUrl) {
        window.location.href = paymentResult.redirectUrl;
        return;
      }
      
      // Create booking data
      const bookingData = {
        propertyId: id!,
        checkIn: selectedDates.from.toISOString().split('T')[0],
        checkOut: selectedDates.to.toISOString().split('T')[0],
        guests: 1, // You can add a guest selector later
        specialRequests: formData.specialRequests,
        cleaningService: formData.cleaningService,
        airportPickup: formData.airportPickup,
        earlyCheckIn: formData.earlyCheckIn,
        billingData: {
          first_name: currentUser?.displayName?.split(' ')[0] || '',
          last_name: currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
          email: currentUser?.email || '',
          phone_number: currentUser?.phoneNumber || '',
          apartment: '',
          floor: '',
          street: '',
          building: '',
          postal_code: '',
          city: '',
          country: 'EG',
          state: ''
        }
      };
      
      // Save booking to backend
      const bookingResponse = await bookingService.createBooking(bookingData);
      const bookingId = bookingResponse.bookingId;
      
      // Show success toast
      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${rental?.title} has been confirmed. Booking ID: ${bookingId}`,
        variant: "default",
      });
      
      // Navigate to user dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground/70">Loading property details...</p>
      </div>
    );
  }
  
  if (error || !rental) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Property Not Found</h1>
        <p className="mb-6">{error || "The property you're looking for doesn't exist or has been removed."}</p>
        <Button onClick={() => navigate("/rentals")}>Back to Rentals</Button>
      </div>
    );
  }
  
  return (
    <div className="bg-beige-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/rentals")}
          >
            ← Back to Rentals
          </Button>
          <h1 className="font-serif text-3xl font-medium mb-2">Complete Your Booking</h1>
          <p className="text-foreground/70">You're just a few steps away from your stay at {rental.title}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-md animate-fade-in">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Guest Information */}
                    <div>
                      <h2 className="text-xl font-medium mb-4 flex items-center">
                        <User className="mr-2 h-5 w-5 text-[#b94a3b]" />
                        Guest Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Stay Dates */}
                    <div>
                      <h2 className="text-xl font-medium mb-4 flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-[#b94a3b]" />
                        Stay Dates
                      </h2>
                      <div className="flex justify-center p-4 bg-white rounded-lg border border-gray-200">
                        <Calendar
                          mode="range"
                          selected={{
                            from: selectedDates.from,
                            to: selectedDates.to,
                          }}
                          onSelect={(range) => {
                            setSelectedDates({
                              from: range?.from,
                              to: range?.to,
                            });
                          }}
                          numberOfMonths={2}
                          className="rounded-md"
                          disabled={{ before: new Date() }}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Additional Services */}
                    <div>
                      <h2 className="text-xl font-medium mb-4 flex items-center">
                        <Check className="mr-2 h-5 w-5 text-[#b94a3b]" />
                        Additional Services
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="cleaningService" 
                            checked={formData.cleaningService}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("cleaningService", checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="cleaningService"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Daily Cleaning Service (50 EGP)
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Professional cleaning service every day during your stay
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="airportPickup" 
                            checked={formData.airportPickup}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("airportPickup", checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="airportPickup"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Airport Pickup (35 EGP)
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Private transportation from Cairo International Airport
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="earlyCheckIn" 
                            checked={formData.earlyCheckIn}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange("earlyCheckIn", checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="earlyCheckIn"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Early Check-in (25 EGP)
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Check in as early as 10:00 AM (normal check-in is 3:00 PM)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Special Requests */}
                    <div>
                      <h2 className="text-xl font-medium mb-4">Special Requests</h2>
                      <Textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requests or requirements for your stay?"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Separator />
                    
                    {/* Payment Method */}
                    <div>
                      <h2 className="text-xl font-medium mb-4 flex items-center">
                        <CreditCard className="mr-2 h-5 w-5 text-[#b94a3b]" />
                        Payment Method
                      </h2>
                      
                      <PaymentGatewaySelector
                        selectedGateway={formData.paymentMethod}
                        selectedMethod={formData.paymentSubMethod}
                        onGatewayChange={(gateway) => setFormData({...formData, paymentMethod: gateway})}
                        onMethodChange={(method) => setFormData({...formData, paymentSubMethod: method})}
                        amount={calculateTotal()}
                        currency="EGP"
                      />
                      
                      <div className="mb-6">
                        <Tabs 
                          defaultValue="paymob" 
                          value={formData.paymentMethod}
                          onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                          className="w-full"
                        >
                          {/* Payment gateway selector replaces old tabs */}
                          
                          {/* Old payment tabs removed - replaced by PaymentGatewaySelector component above */}
                        </Tabs>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          type="submit" 
                          className="w-full bg-[#b94a3b] hover:bg-[#a03e30]" 
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing Booking..." : "Complete Booking"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Summary */}
          <div>
            <Card className="shadow-md sticky top-6 animate-fade-in">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Booking Summary</h2>
                
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={rental.image} 
                    alt={rental.title} 
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-medium">{rental.title}</h3>
                    <div className="flex items-center text-sm text-foreground/70">
                      <MapPin className="h-3 w-3 mr-1" />
                      {rental.location}
                    </div>
                    <div className="flex items-center mt-1 text-sm">
                      <Clock className="h-3 w-3 mr-1 text-foreground/70" />
                      <span>
                        {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Check-in</span>
                    <span className="font-medium">
                      {selectedDates.from?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out</span>
                    <span className="font-medium">
                      {selectedDates.to?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span className="font-medium">2 adults</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'} x {rental.price} EGP</span>
                    <span>{rental.price * calculateNights()} EGP</span>
                  </div>
                  
                  {formData.cleaningService && (
                    <div className="flex justify-between">
                      <span>Daily Cleaning Service</span>
                      <span>50 EGP</span>
                    </div>
                  )}
                  
                  {formData.airportPickup && (
                    <div className="flex justify-between">
                      <span>Airport Pickup</span>
                      <span>35 EGP</span>
                    </div>
                  )}
                  
                  {formData.earlyCheckIn && (
                    <div className="flex justify-between">
                      <span>Early Check-in</span>
                      <span>25 EGP</span>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{calculateTotal()} EGP</span>
                </div>
                
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                    Free cancellation up to 48 hours before check-in
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
