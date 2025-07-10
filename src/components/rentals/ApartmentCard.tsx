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
    <Card className="property-card group overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        {/* Image Carousel */}
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full">
            {imagesToShow.map((img, index) => (
              <CarouselItem key={index} className="h-full">
                <img 
                  src={img} 
                  alt={`${rental.title} - Image ${index + 1}`} 
                  className="object-cover w-full h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8" />
          <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8" />
        </Carousel>
        <div className="absolute top-3 right-3 bg-white py-1 px-3 rounded-full text-sm font-medium z-20">
          ${rental.price} / night
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-serif text-lg font-medium mb-1">{rental.title}</h3>
        <div className="flex justify-between items-center mb-1">
          <p className="text-foreground/70 text-sm flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-primary" />
            {rental.location}
          </p>
          <div className="flex items-center gap-1">
            <StarRating rating={getAverageRating(rental.id)} size={14} />
            <span className="text-xs text-foreground/70">
              {getAverageRating(rental.id) > 0 ? `(${rental.reviews.length})` : "New"}
            </span>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">
            {rental.bedrooms === 0 
              ? "Studio" 
              : `${rental.bedrooms} Bed${rental.bedrooms > 1 ? 's' : ''}`}
          </span>
          <span className="text-foreground/70">
            {rental.bathrooms} Bath{rental.bathrooms > 1 ? 's' : ''}
          </span>
        </div>
        
        <Separator className="my-3" />
        
        <div className="flex flex-wrap gap-1 mb-4">
          {rental.amenities.slice(0, 3).map((amenity) => (
            <span 
              key={amenity} 
              className="bg-beige-50 text-foreground/70 text-xs py-1 px-2 rounded-full flex items-center"
            >
              <Check className="w-3 h-3 mr-1 text-primary" />
              {amenity}
            </span>
          ))}
          {rental.amenities.length > 3 && (
            <span className="bg-beige-50 text-foreground/70 text-xs py-1 px-2 rounded-full">
              +{rental.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/rentals/${rental.id}`)}
          >
            View Details
          </Button>
          <Button 
            className="w-full bg-[#b94a3b] hover:bg-[#9a3f33] text-white"
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
