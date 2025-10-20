import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Wifi, Bath, ParkingSquare, Utensils, Coffee, Eye, Home, Ruler, DoorClosed, Map as MapIcon, ChevronRight } from "lucide-react";
import StarRating from "@/components/reviews/StarRating";
import { getAverageRating } from "@/data/reviewsData";
import type { Apartment } from "@/data/rentalData";
import { useNavigate } from "react-router-dom";
import ImageGallery from "@/components/rentals/ImageGallery";

type DetailsHeroProps = {
  rental: Apartment;
  propertyId: string | number;
};

const amenityItem = (Icon: React.ComponentType<any>, label: string) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="w-9 h-9 rounded-md bg-white border border-gray-100 flex items-center justify-center">
      <Icon className="h-4 w-4 text-foreground/70" />
    </div>
    <span>{label}</span>
  </div>
);

export const DetailsHero: React.FC<DetailsHeroProps> = ({ rental, propertyId }) => {
  const navigate = useNavigate();
  const imagesToShow = rental.images && rental.images.length > 0 ? rental.images : [rental.image];
  const avgRating = getAverageRating(propertyId) || Math.round(rental.owner.rating);

  return (
    <div className="mb-10">
      {/* Title + location */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">{rental.title}</h1>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{avgRating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-foreground/70 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{rental.location}</span>
          {rental.googleMapsUrl && (
            <a
              href={rental.googleMapsUrl.replace("&output=embed&iwloc=near", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b94a3b] hover:text-[#9a3f33] inline-flex items-center gap-1"
            >
              Show on map <ChevronRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo gallery */}
        <div className="lg:col-span-2">
          <ImageGallery images={imagesToShow} alt={rental.title} />
        </div>

        {/* Summary sidebar */}
        <div>
          <Card className="shadow-md">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Exceptional</div>
                  <div className="text-foreground/70">{rental.reviews.length} reviews</div>
                </div>
                <div className="min-w-10 h-10 rounded-lg bg-[#b94a3b] text-white font-semibold flex items-center justify-center px-3">
                  {avgRating}
                </div>
              </div>

              <div className="text-sm">
                <div className="font-medium mb-1">Guests who stayed here loved</div>
                <div className="text-foreground/80">
                  {rental.reviews[0]?.comment || "Great location, stylish interiors and comfortable stay."}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                {amenityItem(Home, "Entire place")}
                {amenityItem(Eye, "View")}
                {amenityItem(Wifi, "Free WiFi")}
                {amenityItem(DoorClosed, "Private bathroom")}
                {amenityItem(Coffee, "Breakfast")}
                {amenityItem(Utensils, "Restaurant")}
                {amenityItem(ParkingSquare, "Free on-site parking")}
                {amenityItem(Bath, "Hot tub")}
                {amenityItem(Ruler, "65 m² size")}
              </div>

              <div className="rounded-lg overflow-hidden border border-gray-200">
                <div className="h-36 relative bg-secondary/30">
                  <iframe
                    src={(rental.googleMapsUrl || "https://www.google.com/maps?q=Madinaty,+Egypt&output=embed").replace("&iwloc=near", "")}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    className="w-full h-full"
                    title="Map preview"
                  />
                </div>
                <div className="p-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <MapIcon className="h-4 w-4" />
                    Show on map
                  </div>
                  <a
                    href={rental.googleMapsUrl?.replace("&output=embed&iwloc=near", "") || "https://maps.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b94a3b] hover:text-[#9a3f33]"
                  >
                    Open
                  </a>
                </div>
              </div>


            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailsHero;


