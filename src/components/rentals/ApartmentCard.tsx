import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronDown, ChevronUp, MapPin, Star, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StarRating from "@/components/reviews/StarRating";
import { getAverageRating } from "@/data/reviewsData";

export interface Apartment {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  amenities: string[];
  description: string;
  owner: {
    name: string;
    phone: string;
    email: string;
    responseTime: string;
    rating: number;
  };
  reviews: {
    user: string;
    rating: number;
    comment: string;
  }[];
  housekeepingOptions: {
    service: string;
    price: number;
    description: string;
  }[];
  availability: boolean;
  images?: string[];
  googleAddress?: string;
  googleMapsUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ApartmentCardProps {
  rental: Apartment;
  expandedCardId: number | null;
  toggleDetails: (id: number) => void;
  handleViewDetails: (id: number) => void;
  selectedDates: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setSelectedDates: React.Dispatch<React.SetStateAction<{
    from: Date | undefined;
    to: Date | undefined;
  }>>;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  rental,
  expandedCardId,
  toggleDetails,
  handleViewDetails,
  selectedDates,
  setSelectedDates
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const calculatePriceBreakdown = (basePrice: number) => {
    return {
      nightly: basePrice,
      weekly: basePrice * 6.5, // 7 nights with discount
      monthly: basePrice * 25, // 30 nights with bigger discount
    };
  };

  // Determine which images to use
  const imagesToShow = rental.images && rental.images.length > 0 
    ? rental.images 
    : [rental.image];

  return (
    <Card className="property-card group overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl border-0">
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        {/* Image Carousel */}
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {imagesToShow.map((img, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative h-full overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${rental.title} - Image ${index + 1}`} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white/90 hover:bg-white border-0 shadow-lg backdrop-blur-sm" />
          <CarouselNext className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 bg-white/90 hover:bg-white border-0 shadow-lg backdrop-blur-sm" />
        </Carousel>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-[#b94a3b] to-[#d4574a] text-white py-2 px-4 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
            <span className="text-lg font-bold">{rental.price}</span>
            <span className="text-xs opacity-90 ml-1">EGP/night</span>
          </div>
        </div>
        
        {/* Availability Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className={`py-1 px-3 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm ${
            rental.availability 
              ? 'bg-green-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            {rental.availability ? '✓ Available' : '✗ Booked'}
          </div>
        </div>
        
        {/* Image Counter */}
        {imagesToShow.length > 1 && (
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-black/50 text-white py-1 px-3 rounded-full text-xs backdrop-blur-sm">
              {currentImageIndex + 1} / {imagesToShow.length}
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="font-serif text-xl font-semibold mb-2 text-gray-800 group-hover:text-[#b94a3b] transition-colors duration-300">
            {rental.title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#b94a3b]" />
              {rental.location}
            </p>
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full">
              <StarRating rating={getAverageRating(rental.id)} size={14} />
              <span className="text-xs text-white font-medium">
                {getAverageRating(rental.id) > 0 ? `(${rental.reviews.length})` : "New"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#b94a3b] mb-1">
                {rental.bedrooms === 0 ? "Studio" : rental.bedrooms}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {rental.bedrooms === 0 ? "" : "Bedroom" + (rental.bedrooms > 1 ? "s" : "")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#b94a3b] mb-1">
                {rental.bathrooms}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                Bathroom{rental.bathrooms > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Featured Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {rental.amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity} 
                className="bg-gradient-to-r from-[#b94a3b]/10 to-[#d4574a]/10 text-[#b94a3b] text-xs py-2 px-3 rounded-full flex items-center font-medium border border-[#b94a3b]/20 hover:bg-[#b94a3b]/20 transition-colors duration-300"
              >
                <Check className="w-3 h-3 mr-1" />
                {amenity}
              </span>
            ))}
            {rental.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs py-2 px-3 rounded-full font-medium">
                +{rental.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="w-full border-2 border-[#b94a3b] text-[#b94a3b] hover:bg-[#b94a3b] hover:text-white transition-all duration-300 font-semibold py-2.5"
            onClick={() => navigate(`/rentals/${rental.id}`)}
          >
            View Details
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-[#b94a3b] to-[#d4574a] hover:from-[#9a3f33] hover:to-[#b94a3b] text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate(`/booking/${rental.id}`)}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
