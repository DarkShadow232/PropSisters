
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Car,
  Bus,
} from "lucide-react";
import CityCarousel from "./location/CityCarousel";
import CityDescription from "./location/CityDescription";
import Map from "./location/Map";

const LocationGuide = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title mb-6">Discover Cairo</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Experience the magic of ancient history and modern luxury in Egypt's vibrant capital
          </p>
        </div>

        <CityCarousel />
        <CityDescription />

        {/* Locations & Distances with Map */}
        <Card className="mb-12 bg-white shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#b94a3b] h-7 w-7 mt-1 flex-shrink-0" />
                  <div className="w-full">
                    <h3 className="font-serif text-2xl font-medium mb-3 text-charcoal-800">Key Locations & Distances</h3>
                    <p className="text-gray-600 mb-4">Explore Cairo's iconic landmarks conveniently located near our rental properties.</p>
                    <ul className="space-y-4 border-l-2 border-[#b94a3b]/20 pl-3">
                      <li className="flex items-center gap-3 group hover:bg-[#b94a3b]/5 p-2 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#b94a3b]/10 flex items-center justify-center group-hover:bg-[#b94a3b]/20 transition-colors">
                          <Clock className="h-4 w-4 text-[#b94a3b] flex-shrink-0" />
                        </div>
                        <div>
                          <span className="font-medium text-base text-charcoal-800">Downtown Cairo</span>
                          <p className="text-sm text-gray-600">25 minutes (12 km) - Cultural heart of the city</p>
                          <p className="text-xs text-gray-500 mt-1">Famous for Khan El-Khalili bazaar and historic mosques</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 group hover:bg-[#b94a3b]/5 p-2 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#b94a3b]/10 flex items-center justify-center group-hover:bg-[#b94a3b]/20 transition-colors">
                          <Clock className="h-4 w-4 text-[#b94a3b] flex-shrink-0" />
                        </div>
                        <div>
                          <span className="font-medium text-base text-charcoal-800">Pyramids of Giza</span>
                          <p className="text-sm text-gray-600">35 minutes (18 km) - World's most famous ancient wonder</p>
                          <p className="text-xs text-gray-500 mt-1">Home to the Great Pyramid and Sphinx, built over 4,500 years ago</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 group hover:bg-[#b94a3b]/5 p-2 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#b94a3b]/10 flex items-center justify-center group-hover:bg-[#b94a3b]/20 transition-colors">
                          <Clock className="h-4 w-4 text-[#b94a3b] flex-shrink-0" />
                        </div>
                        <div>
                          <span className="font-medium text-base text-charcoal-800">Grand Egyptian Museum</span>
                          <p className="text-sm text-gray-600">30 minutes (15 km) - World's largest archaeological museum</p>
                          <p className="text-xs text-gray-500 mt-1">Houses over 100,000 artifacts including Tutankhamun's treasures</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3 group hover:bg-[#b94a3b]/5 p-2 rounded-lg transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#b94a3b]/10 flex items-center justify-center group-hover:bg-[#b94a3b]/20 transition-colors">
                          <Clock className="h-4 w-4 text-[#b94a3b] flex-shrink-0" />
                        </div>
                        <div>
                          <span className="font-medium text-base text-charcoal-800">Cairo International Airport</span>
                          <p className="text-sm text-gray-600">45 minutes (25 km) - Main international gateway</p>
                          <p className="text-xs text-gray-500 mt-1">Egypt's busiest airport with connections to major global cities</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <Map />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transportation Options */}
        <Card className="bg-white shadow-md">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Car className="text-primary h-8 w-8 mt-1 flex-shrink-0" />
              <div className="w-full">
                <h3 className="font-serif text-2xl font-medium mb-4">Getting Around Cairo</h3>
                <Tabs defaultValue="taxi" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8 p-1.5 bg-gray-100/70 rounded-xl shadow-inner overflow-hidden">
                    <TabsTrigger 
                      value="taxi" 
                      className="rounded-lg py-3 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#b94a3b] data-[state=active]:shadow-md data-[state=active]:font-medium"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Ride Services
                    </TabsTrigger>
                    <TabsTrigger 
                      value="car" 
                      className="rounded-lg py-3 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#b94a3b] data-[state=active]:shadow-md data-[state=active]:font-medium"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Private Car
                    </TabsTrigger>
                    <TabsTrigger 
                      value="public" 
                      className="rounded-lg py-3 transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-[#b94a3b] data-[state=active]:shadow-md data-[state=active]:font-medium"
                    >
                      <Bus className="h-4 w-4 mr-2" />
                      Public Transport
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="taxi" className="space-y-4 animate-tab-slide bg-white/50 p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#b94a3b]/10 flex items-center justify-center animate-tab-glow">
                        <Car className="h-5 w-5 text-[#b94a3b]" />
                      </div>
                      <h4 className="font-medium text-lg text-charcoal-800">Ride-Hailing Services</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Uber and Careem are widely available throughout Cairo and are the recommended 
                      options for tourists. Both services are safe, reliable, and offer English interfaces. 
                      Typical costs from our location: Downtown (100-150 EGP), Pyramids (150-200 EGP), 
                      Museum (130-180 EGP).
                    </p>
                  </TabsContent>
                  <TabsContent value="car" className="space-y-4 animate-tab-slide bg-white/50 p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#b94a3b]/10 flex items-center justify-center animate-tab-glow">
                        <Car className="h-5 w-5 text-[#b94a3b]" />
                      </div>
                      <h4 className="font-medium text-lg text-charcoal-800">Private Car & Driver</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      We offer a premium car service with professional English-speaking drivers who are 
                      experts in Cairo's geography and history. Full-day service starts at 1000 EGP 
                      and includes customized itineraries and waiting time at attractions.
                    </p>
                    <Button className="bg-[#b94a3b] hover:bg-[#9a3f33] text-white mt-4 rounded-full px-6">Book Private Driver</Button>
                  </TabsContent>
                  <TabsContent value="public" className="space-y-4 animate-tab-slide bg-white/50 p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#b94a3b]/10 flex items-center justify-center animate-tab-glow">
                        <Bus className="h-5 w-5 text-[#b94a3b]" />
                      </div>
                      <h4 className="font-medium text-lg text-charcoal-800">Public Transportation</h4>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Cairo's metro system is efficient and affordable (5-10 EGP per ride). The nearest 
                      station is 15 minutes walking distance. Buses and microbuses are available but can 
                      be challenging for non-Arabic speakers. We recommend ride-hailing services or our 
                      private car service for the most comfortable experience.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LocationGuide;
