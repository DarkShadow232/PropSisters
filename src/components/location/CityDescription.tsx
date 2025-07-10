
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

const CityDescription = () => {
  return (
    <Card className="mb-12 bg-white shadow-md">
      <CardContent className="p-8">
        <div className="flex items-start gap-4">
          <Globe className="text-primary h-8 w-8 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-serif text-2xl font-medium mb-4">About Cairo</h3>
            <p className="text-foreground/80 mb-4 leading-relaxed">
              Cairo, Egypt's timeless capital, is a city where ancient wonders meet modern luxury. 
              As one of the world's oldest cities, it offers an unparalleled blend of historical 
              grandeur and contemporary comfort. The city is home to over 20 million people, making 
              it a vibrant metropolis where tradition and innovation coexist harmoniously.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              For international visitors, Cairo presents an extraordinary opportunity to experience 
              both luxury living and cultural immersion. From the majestic Pyramids of Giza to the 
              newly opened Grand Egyptian Museum, the largest archaeological museum in the world, 
              every corner of the city tells a story spanning thousands of years. The historic 
              Islamic Cairo district, with its magnificent mosques and bustling Khan el-Khalili bazaar, 
              offers an authentic taste of Egyptian heritage.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityDescription;
