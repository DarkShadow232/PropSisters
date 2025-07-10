import React from 'react';
import { Card } from "@/components/ui/card";
import { MapPin, Landmark, Train, ExternalLink } from "lucide-react";

const Map = () => {
  // List of locations for the legend
  const locations = [
    {
      name: "Our Location",
      description: "Property Sisters Main Location",
      type: 'property'
    },
    {
      name: "Downtown Cairo",
      description: "25 minutes away",
      type: 'attraction'
    },
    {
      name: "Pyramids of Giza",
      description: "35 minutes away",
      type: 'attraction'
    },
    {
      name: "Grand Egyptian Museum",
      description: "30 minutes away",
      type: 'attraction'
    },
    {
      name: "Ramses Station",
      description: "Main Metro Station",
      type: 'metro'
    }
  ];

  return (
    <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-serif font-medium text-center mb-4">Cairo City Map</h2>
      
      {/* Google Maps Integration */}
      <div className="h-[400px] rounded-lg overflow-hidden bg-secondary/30 relative mb-4 border border-gray-200 shadow-inner">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.76983794854!2d31.18401455!3d30.0595581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1682345678901!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          title="Cairo City Map"
        ></iframe>
        
        {/* Map Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="text-gray-700 font-bold">+</span>
          </button>
          <button className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="text-gray-700 font-bold">−</span>
          </button>
        </div>
        
        {/* Map Attribution */}
        <div className="absolute bottom-0 right-0 bg-white/80 px-2 py-1 text-[10px] text-gray-600">
          Map data ©2023 Google · Terms
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-[#e67e22] flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
            <MapPin size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium">Our Properties</span>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-[#3498db] flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
            <Landmark size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium">Key Attractions</span>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-[#7f8c8d] flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
            <Train size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium">Metro Stations</span>
        </div>
      </div>
      
      {/* View larger map link */}
      <div className="text-center mt-4">
        <a 
          href="https://www.google.com/maps/place/Cairo,+Cairo+Governorate,+Egypt" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-[#b94a3b] hover:text-[#9a3f33] inline-flex items-center gap-1 fancy-link"
        >
          View larger map <ExternalLink size={14} />
        </a>
      </div>
      
      {/* Featured Locations */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4 font-serif">Featured Locations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {locations.map((location, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 cursor-pointer">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                location.type === 'property' ? 'bg-[#e67e22]/10 text-[#e67e22]' :
                location.type === 'attraction' ? 'bg-[#3498db]/10 text-[#3498db]' :
                'bg-[#7f8c8d]/10 text-[#7f8c8d]'
              }`}>
                {location.type === 'property' && <MapPin className="h-5 w-5" />}
                {location.type === 'attraction' && <Landmark className="h-5 w-5" />}
                {location.type === 'metro' && <Train className="h-5 w-5" />}
              </div>
              <div>
                <div className="font-medium text-sm">{location.name}</div>
                <div className="text-xs text-gray-600">{location.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Map;
//   100% {
//     box-shadow: 0 0 0 0 rgba(211, 126, 94, 0);
//   }
// }

// .pulse-animation {
//   animation: pulse 2s infinite;
// }
