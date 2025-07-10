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
import { createBooking, checkDateAvailability } from "@/services/bookingService";
import { Timestamp } from "firebase/firestore";

// PayPal icon component since it's not available in lucide-react
const PayPalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 11C6.07003 11 5.44758 10.418 5.17765 9.55557C4.96618 8.86031 4.96618 8.02485 5.17765 7.32959C5.44758 6.46739 6.07003 5.88538 7 5.88538H15C17.2091 5.88538 19 7.67628 19 9.88538C19 12.0945 17.2091 13.8854 15 13.8854H12L10 18H7L9 13.8854H7C6.07003 13.8854 5.44758 13.3034 5.17765 12.441C4.96618 11.7457 4.96618 10.9103 5.17765 10.215C5.44758 9.35283 6.07003 8.77082 7 8.77082" />
  </svg>
);

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    paymentMethod: "credit-card", // Default payment method
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    billingAddress: "",
    billingCity: "",
    billingZip: "",
    billingCountry: "United States",
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
  
  // Find the rental by ID
  const rental = rentals.find((r) => r.id === Number(id));
  
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
  
  // Validate payment information before submission
  const validatePaymentInfo = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (formData.paymentMethod === "credit-card") {
      // Validate credit card number (16 digits)
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
        isValid = false;
      }
      
      // Validate expiry date (MM/YY format)
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = "Please enter a valid expiry date (MM/YY)";
        isValid = false;
      }
      
      // Validate CVV (3 or 4 digits)
      if (!/^\d{3,4}$/.test(formData.cardCVV)) {
        newErrors.cardCVV = "Please enter a valid CVV code";
        isValid = false;
      }
    } else if (formData.paymentMethod === "bank-transfer") {
      // Validate account number
      if (!/^\d{8,17}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = "Please enter a valid account number";
        isValid = false;
      }
      
      // Validate routing number
      if (!/^\d{9}$/.test(formData.routingNumber)) {
        newErrors.routingNumber = "Please enter a valid 9-digit routing number";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
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
      // Check date availability
      const isAvailable = await checkDateAvailability(
        id!,
        selectedDates.from,
        selectedDates.to
      );
      
      if (!isAvailable) {
        toast({
          title: "Dates Not Available",
          description: "The selected dates are already booked. Please choose different dates.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create booking data
      const bookingData = {
        propertyId: id!,
        userId: user.uid,
        checkIn: selectedDates.from,
        checkOut: selectedDates.to,
        guests: 1, // You can add a guest selector later
        totalPrice: calculateTotal(),
        status: 'pending' as const,
        specialRequests: formData.specialRequests,
        cleaningService: formData.cleaningService,
        airportPickup: formData.airportPickup,
        earlyCheckIn: formData.earlyCheckIn
      };
      
      // Save booking to Firebase
      const bookingId = await createBooking(bookingData);
      
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
  
  if (!rental) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Property Not Found</h1>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
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
                              Daily Cleaning Service ($50)
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
                              Airport Pickup ($35)
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
                              Early Check-in ($25)
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
                      
                      <div className="mb-6">
                        <Tabs 
                          defaultValue="credit-card" 
                          value={formData.paymentMethod}
                          onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
                          className="w-full"
                        >
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="credit-card" className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Credit Card
                            </TabsTrigger>
                            <TabsTrigger value="paypal" className="flex items-center gap-2">
                              <PayPalIcon />
                              PayPal
                            </TabsTrigger>
                            <TabsTrigger value="bank-transfer" className="flex items-center gap-2">
                              <BanknoteIcon className="h-4 w-4" />
                              Bank Transfer
                            </TabsTrigger>
                          </TabsList>
                          
                          {/* Credit Card Form */}
                          <TabsContent value="credit-card" className="mt-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="cardName">Name on Card</Label>
                                    <Input
                                      id="cardName"
                                      name="cardName"
                                      value={formData.cardName}
                                      onChange={handleInputChange}
                                      placeholder="John Smith"
                                      required
                                    />
                                  </div>
                                  
                                  <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <div className="relative">
                                      <Input
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        placeholder="1234 5678 9012 3456"
                                        required
                                        className={errors.cardNumber ? "border-red-500" : ""}
                                      />
                                      {errors.cardNumber && (
                                        <div className="text-red-500 text-sm mt-1 flex items-center">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          {errors.cardNumber}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                                    <div className="relative">
                                      <Input
                                        id="cardExpiry"
                                        name="cardExpiry"
                                        value={formData.cardExpiry}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        required
                                        className={errors.cardExpiry ? "border-red-500" : ""}
                                      />
                                      {errors.cardExpiry && (
                                        <div className="text-red-500 text-sm mt-1 flex items-center">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          {errors.cardExpiry}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="cardCVV">CVV</Label>
                                    <div className="relative">
                                      <Input
                                        id="cardCVV"
                                        name="cardCVV"
                                        value={formData.cardCVV}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        required
                                        className={errors.cardCVV ? "border-red-500" : ""}
                                      />
                                      {errors.cardCVV && (
                                        <div className="text-red-500 text-sm mt-1 flex items-center">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          {errors.cardCVV}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-6">
                                  <h3 className="text-sm font-medium mb-3">Billing Address</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 space-y-2">
                                      <Label htmlFor="billingAddress">Street Address</Label>
                                      <Input
                                        id="billingAddress"
                                        name="billingAddress"
                                        value={formData.billingAddress}
                                        onChange={handleInputChange}
                                        placeholder="123 Main St"
                                        required
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="billingCity">City</Label>
                                      <Input
                                        id="billingCity"
                                        name="billingCity"
                                        value={formData.billingCity}
                                        onChange={handleInputChange}
                                        placeholder="New York"
                                        required
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="billingZip">ZIP Code</Label>
                                      <Input
                                        id="billingZip"
                                        name="billingZip"
                                        value={formData.billingZip}
                                        onChange={handleInputChange}
                                        placeholder="10001"
                                        required
                                      />
                                    </div>
                                    
                                    <div className="md:col-span-2 space-y-2">
                                      <Label htmlFor="billingCountry">Country</Label>
                                      <Select
                                        value={formData.billingCountry}
                                        onValueChange={(value) => setFormData({...formData, billingCountry: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="United States">United States</SelectItem>
                                          <SelectItem value="Canada">Canada</SelectItem>
                                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                          <SelectItem value="Australia">Australia</SelectItem>
                                          <SelectItem value="France">France</SelectItem>
                                          <SelectItem value="Germany">Germany</SelectItem>
                                          <SelectItem value="Japan">Japan</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-sm text-blue-800 flex items-start">
                                    <Shield className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                                    Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          
                          {/* PayPal Form */}
                          <TabsContent value="paypal" className="mt-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-center py-8">
                                  <PayPalIcon />
                                  <h3 className="text-lg font-medium mt-4">Pay with PayPal</h3>
                                  <p className="text-muted-foreground mt-2 mb-6">
                                    You'll be redirected to PayPal to complete your payment securely.
                                  </p>
                                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
                                    <p className="text-sm text-amber-800 flex items-start">
                                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                                      This is a demo. No actual payment will be processed. In a real application, clicking the button below would redirect to PayPal.
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          
                          {/* Bank Transfer Form */}
                          <TabsContent value="bank-transfer" className="mt-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Input
                                      id="bankName"
                                      name="bankName"
                                      value={formData.bankName}
                                      onChange={handleInputChange}
                                      placeholder="Chase Bank"
                                      required
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="accountNumber">Account Number</Label>
                                    <div className="relative">
                                      <Input
                                        id="accountNumber"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleInputChange}
                                        placeholder="123456789"
                                        required
                                        className={errors.accountNumber ? "border-red-500" : ""}
                                      />
                                      {errors.accountNumber && (
                                        <div className="text-red-500 text-sm mt-1 flex items-center">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          {errors.accountNumber}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="routingNumber">Routing Number</Label>
                                    <div className="relative">
                                      <Input
                                        id="routingNumber"
                                        name="routingNumber"
                                        value={formData.routingNumber}
                                        onChange={handleInputChange}
                                        placeholder="987654321"
                                        required
                                        className={errors.routingNumber ? "border-red-500" : ""}
                                      />
                                      {errors.routingNumber && (
                                        <div className="text-red-500 text-sm mt-1 flex items-center">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          {errors.routingNumber}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="accountType">Account Type</Label>
                                    <Select
                                      value={formData.accountType}
                                      onValueChange={(value) => setFormData({...formData, accountType: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select account type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="checking">Checking</SelectItem>
                                        <SelectItem value="savings">Savings</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <p className="text-sm text-amber-800 flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600" />
                                    This is a demo. No actual bank details will be stored or processed. In a real application, your bank information would be securely stored and verified.
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
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
                    <span>{calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'} x ${rental.price}</span>
                    <span>${rental.price * calculateNights()}</span>
                  </div>
                  
                  {formData.cleaningService && (
                    <div className="flex justify-between">
                      <span>Daily Cleaning Service</span>
                      <span>$50</span>
                    </div>
                  )}
                  
                  {formData.airportPickup && (
                    <div className="flex justify-between">
                      <span>Airport Pickup</span>
                      <span>$35</span>
                    </div>
                  )}
                  
                  {formData.earlyCheckIn && (
                    <div className="flex justify-between">
                      <span>Early Check-in</span>
                      <span>$25</span>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
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
