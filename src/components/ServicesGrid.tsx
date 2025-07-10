import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bed, 
  Paintbrush, 
  Sparkles, 
  KeyRound, 
  ShowerHead, 
  Zap, 
  Car, 
  Users 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, linkTo }) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full border border-gray-100 rounded-xl overflow-hidden">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-rustic-50 flex items-center justify-center mb-5 shadow-sm">
            {icon}
          </div>
          <h3 className="font-serif text-xl font-medium mb-3 text-charcoal-800">{title}</h3>
          <p className="text-gray-500 mb-5 flex-grow leading-relaxed">
            {description}
          </p>
          <Link 
            to={linkTo} 
            className="bg-[#b94a3b] hover:bg-[#9a3f33] text-white font-medium inline-flex items-center mt-auto px-5 py-3 rounded-full transition-colors w-full justify-center shadow-md"
          >
            Learn More
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const ServicesGrid = () => {
  const services = [
    {
      icon: <Bed className="text-rustic-600 h-7 w-7" />,
      title: "Short-Term Rentals",
      description: "Find the perfect apartment for your stay, whether it's for a few days, weeks, or months. All our properties are fully furnished and ready to move in.",
      linkTo: "/rentals"
    },
    {
      icon: <Paintbrush className="text-rustic-600 h-7 w-7" />,
      title: "Apartment Finishing",
      description: "Transform your space with our professional apartment finishing services. Submit your request and our experts will bring your vision to life.",
      linkTo: "/finish-request"
    },
    {
      icon: <Sparkles className="text-rustic-600 h-7 w-7" />,
      title: "Housekeeping",
      description: "Keep your rental spotless with our professional housekeeping services. Available for one-time cleaning or regular maintenance during your stay.",
      linkTo: "/services"
    },
    {
      icon: <KeyRound className="text-rustic-600 h-7 w-7" />,
      title: "Check-in & Check-out",
      description: "Enjoy a hassle-free experience with our personalized check-in and check-out services. We ensure a smooth transition for all our guests.",
      linkTo: "/services"
    },
    {
      icon: <ShowerHead className="text-rustic-600 h-7 w-7" />,
      title: "Laundry Services",
      description: "Keep your clothes fresh and clean with our convenient laundry services. We offer pick-up and delivery options to make your stay more comfortable.",
      linkTo: "/services"
    },
    {
      icon: <Zap className="text-rustic-600 h-7 w-7" />,
      title: "Electricity Pop-up",
      description: "Never worry about power outages. Our electricity pop-up service ensures you have backup power for essential needs during unexpected outages.",
      linkTo: "/services"
    },
    {
      icon: <Car className="text-rustic-600 h-7 w-7" />,
      title: "Request a Personal Ride",
      description: "Explore Cairo with ease using our personal driver service. Our knowledgeable drivers provide safe transportation to all your destinations.",
      linkTo: "/services"
    },
    {
      icon: <Users className="text-rustic-600 h-7 w-7" />,
      title: "Property Sisters Club",
      description: "Join our exclusive membership program for special discounts, priority bookings, and unique experiences tailored to frequent travelers.",
      linkTo: "/services"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {services.map((service, index) => (
          <ServiceCard 
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            linkTo={service.linkTo}
          />
        ))}
      </div>

    </div>
  );
};

export default ServicesGrid;
