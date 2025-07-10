import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  MapPin, 
  Star, 
  CalendarIcon, 
  Check, 
  Info, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  User, 
  Share2, 
  Download,
  Coffee,
  Utensils,
  Bus,
  Building,
  ShoppingBag,
  ParkingSquare,
  MessageCircle,
  Briefcase,
  Calendar as CalendarIcon2,
  BedDouble,
  BookmarkPlus,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { rentals } from "@/data/rentalData";
import { Apartment } from "@/data/rentalData";
import { useToast } from "@/hooks/use-toast";
import Reviews from "@/components/reviews/Reviews";
import StarRating from "@/components/reviews/StarRating";
import { getAverageRating } from "@/data/reviewsData";

const RentalDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  
  // Find the rental by ID
  const rental = rentals.find((r) => r.id === Number(id));
  
  if (!rental) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Property Not Found</h1>
        <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/rentals")}>Back to Rentals</Button>
      </div>
    );
  }
  
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
    return total;
  };
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? `${rental.title} has been removed from your favorites.` 
        : `${rental.title} has been added to your favorites.`,
      variant: "default",
    });
  };
  
  // Determine which images to use
  const imagesToShow = rental.images && rental.images.length > 0 
    ? rental.images 
    : [rental.image];
    
  // Setup carousel navigation  
  React.useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);
  
  // Function to select a specific slide
  const selectSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };
  
  // Check if this is Apartment 1 which has the video
  const hasVideo = rental.id === 1;
  const videoUrl = "/image/Apartments/Ap1/VID-20250327-WA0001.mp4";
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: rental.title,
        text: `Check out this amazing property: ${rental.title}`,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Shared Successfully",
          description: "You've shared this property with others.",
          variant: "default",
        });
      })
      .catch((error) => {
        toast({
          title: "Sharing Failed",
          description: "Could not share this property.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link Copied",
          description: "Property link copied to clipboard.",
          variant: "default",
        });
      });
    }
  };
  
  const handleDownloadFloorPlan = () => {
    toast({
      title: "Floor Plan",
      description: "The floor plan would be downloaded here. This feature is coming soon.",
      variant: "default",
    });
  };
  
  const handleContactHost = () => {
    toast({
      title: "Contact Host",
      description: `A message has been sent to ${rental.owner.name}. They will respond to you shortly.`,
      variant: "default",
    });
  };

  const handleSaveToTrip = () => {
    toast({
      title: "Saved to Trip",
      description: "This property has been saved to your trip planner.",
      variant: "default",
    });
  };
  
  const openFullscreen = (index: number) => {
    setFullscreenImageIndex(index);
    setIsFullscreenOpen(true);
  };

  // Find similar properties based on location, bedrooms, or price range
  const getSimilarProperties = () => {
    return rentals
      .filter(r => 
        r.id !== rental.id && 
        (r.location === rental.location || 
         Math.abs(r.bedrooms - rental.bedrooms) <= 1 || 
         Math.abs(r.price - rental.price) <= 50)
      )
      .slice(0, 3);
  };

  const similarProperties = getSimilarProperties();
  
  // Generate some fake availability data for visualization
  const generateAvailabilityData = () => {
    const today = new Date();
    const bookedDates = [];
    
    // Add some random booked dates for the next 2 months
    for (let i = 1; i <= 60; i++) {
      const randomDay = new Date(today);
      randomDay.setDate(today.getDate() + i);
      
      // Randomly mark some dates as booked (about 30%)
      if (Math.random() < 0.3) {
        bookedDates.push(randomDay.toISOString().split('T')[0]);
      }
    }
    
    return bookedDates;
  };
  
  const bookedDates = generateAvailabilityData();
  
  // Function to check if a date is booked
  const isDateBooked = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookedDates.includes(dateString);
  };
  
  return (
    <div className="bg-beige-50 min-h-screen py-12">
      <div className="container-custom">
        {/* Fullscreen Image Dialog */}
        <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
          <DialogContent className="max-w-screen-xl p-0 h-[90vh] flex items-center justify-center bg-black/95">
            <DialogClose className="absolute right-4 top-4 z-50">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={imagesToShow[fullscreenImageIndex]} 
                alt={`${rental.title} - Fullscreen`}
                className="max-h-full max-w-full object-contain"
              />
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => setFullscreenImageIndex((prev) => (prev === 0 ? imagesToShow.length - 1 : prev - 1))}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => setFullscreenImageIndex((prev) => (prev === imagesToShow.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
              
              <div className="absolute bottom-4 text-white text-sm">
                {fullscreenImageIndex + 1} / {imagesToShow.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/rentals")}
          >
            ← Back to Rentals
          </Button>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">{rental.title}</h1>
              <div className="flex items-center text-foreground/70">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{rental.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleShare}
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleSaveToTrip}
                title="Save to Trip"
              >
                <BookmarkPlus className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleDownloadFloorPlan}
                title="Download Floor Plan"
              >
                <Download className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className={isFavorite ? "text-red-500" : ""}
                onClick={handleFavoriteToggle}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
              </Button>
              
              <div className="text-2xl font-medium text-[#b94a3b]">
                ${rental.price}<span className="text-sm font-normal text-foreground/70"> / night</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Images Gallery */}
        <div className="mb-8 animate-fade-in">
          <Card className="shadow-md overflow-hidden">
            <Carousel className="w-full" setApi={setApi}>
              <CarouselContent>
                {imagesToShow.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[500px] w-full group">
                      <img 
                        src={img} 
                        alt={`${rental.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openFullscreen(index)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-4 top-4 bg-white/70 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => openFullscreen(index)}
                      >
                        <Maximize2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
            </Carousel>
          </Card>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-5 gap-2 mt-2">
            {imagesToShow.slice(0, 5).map((img, index) => (
              <div 
                key={index} 
                className={`h-20 cursor-pointer rounded-md overflow-hidden ${currentSlide === index ? 'ring-2 ring-[#b94a3b]' : ''}`}
                onClick={() => selectSlide(index)}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
          {imagesToShow.length > 5 && (
            <div className="mt-2 text-sm text-right">
              <Button 
                variant="link" 
                className="p-0 h-auto text-[#b94a3b]"
                onClick={() => {
                  toast({
                    title: "All Images",
                    description: `This property has ${imagesToShow.length} images. Scroll through the carousel to view all.`,
                    variant: "default",
                  });
                }}
              >
                +{imagesToShow.length - 5} more images
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-md mb-8 animate-fade-in">
              <CardContent className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className={`grid w-full ${hasVideo ? 'grid-cols-4' : 'grid-cols-3'} mb-6`}>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    {hasVideo && <TabsTrigger value="video">Video Tour</TabsTrigger>}
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6">
                    <div>
                      <h2 className="text-xl font-medium mb-4">Property Overview</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                          <div className="text-lg font-medium">{rental.bedrooms}</div>
                          <div className="text-sm text-foreground/70">Bedrooms</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                          <div className="text-lg font-medium">{rental.bathrooms}</div>
                          <div className="text-sm text-foreground/70">Bathrooms</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                          <div className="text-lg font-medium text-green-600">
                            {rental.availability ? "Available" : "Booked"}
                          </div>
                          <div className="text-sm text-foreground/70">Status</div>
                        </div>
                      </div>
                      
                      <p className="text-foreground/80 leading-relaxed">
                        {rental.description}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-xl font-medium mb-4">Location</h2>
                      <div className="h-[300px] rounded-lg overflow-hidden bg-secondary/30 relative mb-4 border border-gray-200 shadow-inner">
                        <iframe 
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.76983794854!2d31.18401455!3d30.0595581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1682345678901!5m2!1sen!2sus" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen={true} 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                          title="Property Location"
                        ></iframe>
                      </div>
                      <p className="text-foreground/70 text-sm">
                        Exact address will be provided after booking confirmation.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-xl font-medium mb-4">What's Nearby</h2>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <Coffee className="h-5 w-5 text-[#b94a3b] mt-0.5" />
                            <div>
                              <div className="font-medium">Coffee Shops</div>
                              <div className="text-sm text-foreground/70">Several coffee shops within 5 minutes walk</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <Utensils className="h-5 w-5 text-[#b94a3b] mt-0.5" />
                            <div>
                              <div className="font-medium">Restaurants</div>
                              <div className="text-sm text-foreground/70">Multiple dining options nearby</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <Bus className="h-5 w-5 text-[#b94a3b] mt-0.5" />
                            <div>
                              <div className="font-medium">Public Transport</div>
                              <div className="text-sm text-foreground/70">Bus station 3 minutes away</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <ShoppingBag className="h-5 w-5 text-[#b94a3b] mt-0.5" />
                            <div>
                              <div className="font-medium">Shopping</div>
                              <div className="text-sm text-foreground/70">Shopping center within 10 minutes walk</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <ParkingSquare className="h-5 w-5 text-[#b94a3b] mt-0.5" />
                            <div>
                              <div className="font-medium">Parks</div>
                              <div className="text-sm text-foreground/70">City park just 5 minutes away</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <Building className="h-5 w-5 text-[#b94a3b] mt-0.5" />
                            <div>
                              <div className="font-medium">Attractions</div>
                              <div className="text-sm text-foreground/70">Cultural venues and attractions nearby</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-xl font-medium mb-4">House Rules</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-foreground/70" />
                          </div>
                          <div>
                            <div className="font-medium">Check-in</div>
                            <div className="text-sm text-foreground/70">After 3:00 PM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-foreground/70" />
                          </div>
                          <div>
                            <div className="font-medium">Check-out</div>
                            <div className="text-sm text-foreground/70">Before 11:00 AM</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>No smoking inside the property</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>No parties or events</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>Pets allowed with prior approval</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>Self check-in with building staff</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="amenities" className="space-y-6">
                    <div>
                      <h2 className="text-xl font-medium mb-4">Amenities</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        {rental.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-[#b94a3b]" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-xl font-medium mb-4">Housekeeping Services</h2>
                      <div className="space-y-4">
                        {rental.housekeepingOptions.map((option, index) => (
                          <div key={index} className="flex justify-between items-start p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                            <div>
                              <div className="font-medium">{option.service}</div>
                              <div className="text-sm text-foreground/70">{option.description}</div>
                            </div>
                            <div className="font-medium">${option.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-6">
                    <Reviews propertyId={Number(id)} />
                  </TabsContent>
                  
                  {hasVideo && (
                    <TabsContent value="video" className="space-y-6">
                      <div>
                        <h2 className="text-xl font-medium mb-4">Video Tour</h2>
                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <video 
                            controls 
                            className="w-full h-auto" 
                            poster={rental.image}
                          >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <p className="mt-4 text-foreground/70">
                          Take a virtual tour of this beautiful property to get a better feel for the space and layout.
                        </p>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="shadow-md animate-fade-in">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Host Information</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-foreground/70" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{rental.owner.name}</h3>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(rental.owner.rating) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : star <= rental.owner.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm">{rental.owner.rating}</span>
                    </div>
                    <p className="text-sm text-foreground/70 mt-2">
                      Host since January 2020 • {rental.owner.responseTime} response time
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-foreground/70" />
                        <span>{rental.owner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-foreground/70" />
                        <span>{rental.owner.email}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="mt-4 w-full bg-[#b94a3b] hover:bg-[#9a3f33] text-white"
                      onClick={handleContactHost}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Host
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Card */}
          <div>
            <Card className="shadow-md sticky top-6 animate-fade-in">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">Book This Property</h2>
                
                <div className="mb-4">
                  <div className="text-2xl font-medium text-[#b94a3b] mb-2">
                    ${rental.price}<span className="text-sm font-normal text-foreground/70"> / night</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-foreground/70">
                    <StarRating rating={getAverageRating(Number(id))} size={16} className="mr-1" />
                    <span>{getAverageRating(Number(id))} • {rental.reviews.length} reviews</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium block">Select Dates</label>
                      <div className="text-xs flex items-center gap-2">
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-[#b94a3b] rounded-full mr-1"></div>
                          Booked
                        </span>
                        <span className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                          Available
                        </span>
                      </div>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDates.from ? (
                            selectedDates.to ? (
                              <>
                                {selectedDates.from.toLocaleDateString()} - {selectedDates.to.toLocaleDateString()}
                              </>
                            ) : (
                              selectedDates.from.toLocaleDateString()
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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
                          className="p-3"
                          disabled={(date) => {
                            // Disable dates before today
                            const isBeforeToday = date < new Date();
                            // Disable booked dates
                            const isBooked = bookedDates.includes(date.toISOString().split('T')[0]);
                            return isBeforeToday || isBooked;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>${rental.price} x {calculateNights()} nights</span>
                        <span>${rental.price * calculateNights()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning fee</span>
                        <span>$35</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>$25</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${calculateTotal() + 60}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#b94a3b] hover:bg-[#9a3f33] text-white py-6"
                    onClick={() => navigate(`/booking/${rental.id}`)}
                  >
                    Book Now
                  </Button>
                  
                  <div className="text-center text-sm text-foreground/70">
                    You won't be charged yet
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 flex items-start">
                    <Info className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                    Free cancellation up to 48 hours before check-in
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-medium mb-6">Similar Properties You May Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white py-1 px-3 rounded-full text-sm font-medium">
                      ${property.price} / night
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-sm text-foreground/70 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="flex items-center">
                        <BedDouble className="h-4 w-4 mr-1" />
                        {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Bed${property.bedrooms > 1 ? 's' : ''}`}
                      </span>
                      <span>{property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                    <Button 
                      className="w-full bg-[#b94a3b] hover:bg-[#9a3f33] text-white mt-2"
                      onClick={() => navigate(`/rentals/${property.id}`)}
                    >
                      View Property
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalDetailsPage;
