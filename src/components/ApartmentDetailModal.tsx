import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Check, MapPin, Star, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Apartment = {
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
  // Additional images for the gallery
  images?: string[];
};

type ApartmentDetailModalProps = {
  apartment: Apartment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookNow: (apartmentId: number) => void;
};

const ApartmentDetailModal: React.FC<ApartmentDetailModalProps> = ({
  apartment,
  open,
  onOpenChange,
  onBookNow,
}) => {
  const [selectedDates, setSelectedDates] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Default gallery images if not provided
  const galleryImages = apartment?.images || [
    apartment?.image || "",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  ];

  const calculatePriceBreakdown = (basePrice: number) => {
    return {
      nightly: basePrice,
      weekly: basePrice * 6.5, // 7 nights with discount
      monthly: basePrice * 25, // 30 nights with bigger discount
    };
  };

  if (!apartment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{apartment.title}</DialogTitle>
          <DialogDescription className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1 text-primary" />
            {apartment.location}
          </DialogDescription>
        </DialogHeader>

        {/* Image Gallery */}
        <div className="mb-6">
          <Carousel className="w-full">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${apartment.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Detailed Description */}
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-foreground/70">{apartment.description}</p>
            </div>

            <Separator />

            {/* Features & Amenities */}
            <div>
              <h3 className="text-lg font-medium mb-2">Features & Amenities</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Bedrooms:</span>
                  <span>{apartment.bedrooms === 0 ? "Studio" : apartment.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">Bathrooms:</span>
                  <span>{apartment.bathrooms}</span>
                </div>
              </div>

              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {apartment.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-primary" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Owner Information */}
            <div>
              <h3 className="text-lg font-medium mb-2">Owner Information</h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Host:</span> {apartment.owner.name}
                </p>
                <p>
                  <span className="font-medium">Contact:</span> {apartment.owner.phone} | {apartment.owner.email}
                </p>
                <p>
                  <span className="font-medium">Response:</span> {apartment.owner.responseTime}
                </p>
                <div className="flex items-center mt-2">
                  <span className="font-medium mr-2">Host Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(apartment.owner.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : star <= apartment.owner.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm">{apartment.owner.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reviews */}
            <div>
              <h3 className="text-lg font-medium mb-2">Guest Reviews</h3>
              <div className="space-y-3">
                {apartment.reviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">{review.user}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-foreground/70">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Booking Section */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-medium">${apartment.price}</div>
                  <div className="text-sm text-foreground/70">per night</div>
                </div>

                <Separator />

                {/* Date Selection */}
                <div>
                  <h4 className="font-medium mb-2">Select Dates</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
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
                          "Select check-in & check-out dates"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
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
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div>
                  <h4 className="font-medium mb-2">Price Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(calculatePriceBreakdown(apartment.price)).map(([duration, price]) => (
                      <div key={duration} className="flex justify-between">
                        <span className="capitalize">{duration} rate:</span>
                        <span className="font-medium">${Math.round(price)}</span>
                      </div>
                    ))}
                    <div className="text-xs text-foreground/60 mt-1">
                      *Discounts applied for longer stays
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Housekeeping Services */}
                <div>
                  <h4 className="font-medium mb-2">Optional Housekeeping</h4>
                  <div className="space-y-2">
                    {apartment.housekeepingOptions.map((option, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <span className="font-medium">{option.service}</span>
                          <p className="text-xs text-foreground/70">{option.description}</p>
                        </div>
                        <span>${option.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={() => onBookNow(apartment.id)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApartmentDetailModal;
