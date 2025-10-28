
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  CalendarIcon, 
  Filter, 
  Home, 
  Users 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  guestsFilter: string;
  setGuestsFilter: (value: string) => void;
  durationFilter: string;
  setDurationFilter: (value: string) => void;
  amenitiesFilter: string[];
  setAmenitiesFilter: (value: string[]) => void;
  bedroomsFilter: string;
  setBedroomsFilter: (value: string) => void;
  bathroomsFilter: string;
  setBathroomsFilter: (value: string) => void;
  clearAllFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  priceRange, 
  setPriceRange,
  locationFilter,
  setLocationFilter,
  guestsFilter,
  setGuestsFilter,
  durationFilter,
  setDurationFilter,
  amenitiesFilter,
  setAmenitiesFilter,
  bedroomsFilter,
  setBedroomsFilter,
  bathroomsFilter,
  setBathroomsFilter,
  clearAllFilters
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border h-fit">
      <h2 className="font-serif text-lg font-medium mb-6 flex items-center">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </h2>

      {/* Location */}
      <div className="mb-6">
        <label className="form-label">Location</label>
        <Input 
          placeholder="City, neighborhood, address..."
          className="form-input"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      {/* Dates */}
      <div className="mb-6">
        <label className="form-label flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Check-in / Check-out
        </label>
        <Input 
          placeholder="Select dates"
          className="form-input"
        />
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="form-label flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Guests
        </label>
        <Select value={guestsFilter} onValueChange={setGuestsFilter}>
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Number of guests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1 Guest</SelectItem>
            <SelectItem value="2">2 Guests</SelectItem>
            <SelectItem value="3">3 Guests</SelectItem>
            <SelectItem value="4">4 Guests</SelectItem>
            <SelectItem value="5">5+ Guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rental Duration */}
      <div className="mb-6">
        <label className="form-label flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Duration
        </label>
        <Select value={durationFilter} onValueChange={setDurationFilter}>
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Rental period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="form-label">Bedrooms</label>
        <Select value={bedroomsFilter} onValueChange={setBedroomsFilter}>
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Number of bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="0">Studio</SelectItem>
            <SelectItem value="1">1 Bedroom</SelectItem>
            <SelectItem value="2">2 Bedrooms</SelectItem>
            <SelectItem value="3">3 Bedrooms</SelectItem>
            <SelectItem value="4">4+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="form-label">Bathrooms</label>
        <Select value={bathroomsFilter} onValueChange={setBathroomsFilter}>
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Number of bathrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1 Bathroom</SelectItem>
            <SelectItem value="2">2 Bathrooms</SelectItem>
            <SelectItem value="3">3+ Bathrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />

      {/* Price Range */}
      <div className="mb-6">
        <label className="form-label mb-4">
          Price Range (per night)
        </label>
        <Slider
          defaultValue={[2000, 3500]}
          max={5000}
          min={1000}
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm">
          <span>{priceRange[0].toLocaleString()} EGP</span>
          <span>{priceRange[1].toLocaleString()}+ EGP</span>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Amenities */}
      <div className="mb-6">
        <label className="form-label mb-3">Amenities</label>
        <div className="space-y-3">
          {["WiFi", "Air Conditioning", "Kitchen", "Washer", "Pool", "Gym", "Parking", "Pets Allowed"].map((amenity) => (
            <div className="flex items-center space-x-2" key={amenity}>
              <Checkbox 
                id={`amenity-${amenity}`}
                checked={amenitiesFilter.includes(amenity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setAmenitiesFilter([...amenitiesFilter, amenity]);
                  } else {
                    setAmenitiesFilter(amenitiesFilter.filter(a => a !== amenity));
                  }
                }}
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Button className="w-full">Apply Filters</Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
