
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortResultsProps {
  resultsCount: number;
}

const SortResults: React.FC<SortResultsProps> = ({ resultsCount }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-foreground/70">
        <span className="font-medium text-foreground">{resultsCount}</span> properties found
      </p>
      <div className="flex items-center">
        <label className="text-sm mr-2">Sort by:</label>
        <Select defaultValue="recommended">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortResults;
