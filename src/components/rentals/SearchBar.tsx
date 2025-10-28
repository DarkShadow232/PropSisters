
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy 
}) => {
  return (
    <div className="bg-white mb-6 p-4 rounded-lg shadow-sm border border-border">
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by location, property name, amenities..."
            className="pl-9 pr-4 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 h-11">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="bedrooms-asc">Bedrooms: Few to Many</SelectItem>
              <SelectItem value="bedrooms-desc">Bedrooms: Many to Few</SelectItem>
              <SelectItem value="bathrooms-asc">Bathrooms: Few to Many</SelectItem>
              <SelectItem value="bathrooms-desc">Bathrooms: Many to Few</SelectItem>
              <SelectItem value="title-asc">Name: A to Z</SelectItem>
              <SelectItem value="title-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="whitespace-nowrap h-11 px-6">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
