import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import StarRating from "@/components/reviews/StarRating";
import { getAverageRating } from "@/data/reviewsData";

export interface Apartment {
  id: number | string;
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

// Function to get the best image for display
const getBestDisplayImage = (rental: Apartment): string => {
  // If there are multiple images, try to find the best one
  if (rental.images && rental.images.length > 0) {
    // Prefer the main image if it exists in the images array
    const mainImageIndex = rental.images.findIndex(img => img === rental.image);
    if (mainImageIndex !== -1) {
      return rental.images[mainImageIndex];
    }
    
    // Otherwise, use the first image from the array
    return rental.images[0];
  }
  
  // Fallback to the main image
  return rental.image;
};

const ApartmentCard: React.FC<ApartmentCardProps> = ({
  rental,
  expandedCardId,
  toggleDetails,
  handleViewDetails,
  selectedDates,
  setSelectedDates
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get the best image for display
  const displayImage = getBestDisplayImage(rental);
  
  // Fallback image if the main image fails to load
  const fallbackImage = "/placeholder.svg";

  const average = getAverageRating(rental.id);

  const ratingLabel = (r: number) => {
    if (r >= 9) return "Exceptional";
    if (r >= 8) return "Fabulous";
    if (r >= 7) return "Very good";
    if (r > 0) return "Good";
    return "New";
  };

  const formattedPrice = new Intl.NumberFormat("en-EG", { maximumFractionDigits: 2 }).format(rental.price);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white">
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={imageError ? fallbackImage : displayImage} 
          alt={rental.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
        {/* Image overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-[17px] font-semibold leading-snug mb-1">{rental.title}</h3>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <MapPin className="h-4 w-4 text-[#b94a3b]" />
            <span className="truncate">{rental.location}</span>
          </div>
        </div>

        <div className="text-sm text-foreground/80 mb-3">
          {expanded ? (
            <>
              {rental.description}
              <button className="text-[#b94a3b] ml-1" onClick={() => setExpanded(false)}>Show less</button>
            </>
          ) : (
            <>
              <span className="line-clamp-3">{rental.description}</span>
              <button className="text-[#b94a3b] ml-1" onClick={() => setExpanded(true)}>Show more</button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm">
            <div className="font-medium">{ratingLabel(average)}</div>
            <div className="text-foreground/70">{rental.reviews.length} reviews</div>
          </div>
          <div className="min-w-10 h-10 rounded-lg bg-[#b94a3b] text-white font-semibold flex items-center justify-center px-3">
            {average || "-"}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-emerald-700 text-lg font-extrabold">EGP {formattedPrice}</div>
          <div className="text-xs text-foreground/70">1 night, 2 adults</div>
        </div>

        <Button className="w-full bg-[#b94a3b] hover:bg-[#9a3f33] text-white" onClick={() => {
          console.log('🏠 Navigating to rental details for ID:', rental.id);
          navigate(`/rentals/${rental.id}`);
        }}>
          Check availability
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApartmentCard;
