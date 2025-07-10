
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  return (
    <div className="bg-white mb-6 p-4 rounded-lg shadow-sm border border-border">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by location, property name..."
          className="pl-9"
        />
      </div>
      <Button className="ml-2 whitespace-nowrap">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
