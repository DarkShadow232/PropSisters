
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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  priceRange, 
  setPriceRange 
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
        <Select>
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Number of guests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Guest</SelectItem>
            <SelectItem value="2">2 Guests</SelectItem>
            <SelectItem value="3">3 Guests</SelectItem>
            <SelectItem value="4">4 Guests</SelectItem>
            <SelectItem value="5+">5+ Guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rental Duration */}
      <div className="mb-6">
        <label className="form-label flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Duration
        </label>
        <Select>
          <SelectTrigger className="form-input">
            <SelectValue placeholder="Rental period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
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
          defaultValue={[100, 500]}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Amenities */}
      <div className="mb-6">
        <label className="form-label mb-3">Amenities</label>
        <div className="space-y-3">
          {["WiFi", "Air Conditioning", "Kitchen", "Washer", "Pool", "Gym", "Parking", "Pets Allowed"].map((amenity) => (
            <div className="flex items-center space-x-2" key={amenity}>
              <Checkbox id={`amenity-${amenity}`} />
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

      <Button className="w-full">Apply Filters</Button>
    </div>
  );
};

export default FilterSidebar;
