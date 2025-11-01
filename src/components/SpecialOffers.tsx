import React from "react";
import { Hospital, Ticket, UtensilsCrossed, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import nilosImage from "/image/firstImages.jpg";

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-gray-50 reveal-on-scroll">
      <div className="container-custom">
        <h2 className="text-3xl font-serif font-medium text-center mb-10 text-charcoal-800">
          Special Offers & Partnerships
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {/* Medical Tourism Package */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover-lift">
            <div className="p-8">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center animate-pulse-soft">
                  <Hospital className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-center mb-3">Medical Tourism Package</h3>
              
              <p className="text-gray-600 text-center mb-6">
                Planning a visit for medical treatment? We've partnered with top 
                medical centers in Cairo to provide comprehensive packages for 
                international patients.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Special rates for extended stays</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Free transportation to/from medical facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Discounted rates at partner medical centers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Multilingual medical concierge service</span>
                </li>
              </ul>
              
              <div className="flex justify-center">
                <Link to="/services">
                  <Button variant="outline" className="border-[#b94a3b] text-[#b94a3b] hover:bg-[#b94a3b]/5 hover-lift">
                    LEARN MORE
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* 10% Off Amusement Parks */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover-lift">
            <div className="p-8">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center animate-pulse-soft">
                  <Ticket className="h-8 w-8 text-amber-500" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-center mb-3">10% Off Amusement Parks</h3>
              
              <p className="text-gray-600 text-center mb-6">
                Enjoy your stay and have fun with the whole family! Our guests 
                receive exclusive 10% discounts at major amusement parks in the 
                compound.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Valid for all family members</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Includes fast-track entry at select locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Combine with other available promotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Just show your booking confirmation</span>
                </li>
              </ul>
              
              <div className="flex justify-center">
                <Link to="/services">
                  <Button variant="outline" className="border-[#b94a3b] text-[#b94a3b] hover:bg-[#b94a3b]/5 hover-lift">
                    VIEW PARTICIPATING PARKS
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Nilos Restaurant Partnership */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover-lift">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={nilosImage} 
                alt="Nilos Restaurant" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-serif font-medium text-white">Nilos</h3>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center animate-pulse-soft">
                  <UtensilsCrossed className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-center mb-3">Restaurant Partnership</h3>
              
              <p className="text-gray-600 text-center mb-6">
                Enjoy exclusive dining experiences at Nilos, one of Dokki's finest restaurants. Our guests receive special privileges and discounts.
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Exclusive discounts for our guests</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Priority reservations available</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <svg className="h-5 w-5 text-[#b94a3b]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" className="fill-[#b94a3b]/10" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Fine dining experience in Dokki</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">
                    <MapPin className="h-5 w-5 text-[#b94a3b]" />
                  </div>
                  <span className="text-gray-700 text-sm">Ad Doqi A, Dokki, Giza</span>
                </li>
              </ul>
              
              <div className="flex justify-center">
                <a 
                  href="https://maps.app.goo.gl/qSWYRMXGkySNK3KG7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="border-[#b94a3b] text-[#b94a3b] hover:bg-[#b94a3b]/5 hover-lift">
                    VIEW LOCATION
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-10 animate-float">
          <Link to="/rentals">
            <Button className="bg-[#b94a3b] hover:bg-[#9a3f33] text-white px-8 py-6 rounded-md font-medium shadow-md gradient-border">
              FIND YOUR PERFECT CAIRO STAY
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
