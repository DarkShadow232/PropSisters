
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

const MobileFilter: React.FC = () => {
  return (
    <div className="lg:hidden flex gap-2 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by location, property name..."
          className="pl-9"
        />
      </div>
      <Button variant="outline" className="flex items-center gap-1">
        <Filter className="h-4 w-4" />
        Filters
      </Button>
    </div>
  );
};

export default MobileFilter;
