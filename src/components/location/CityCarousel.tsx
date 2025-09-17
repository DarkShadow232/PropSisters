
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CityCarousel = () => {
  const images = [
    {
      url: "/image/DISCOVER EGYPT/Pyramids of Giza.jpg",
      alt: "The iconic Great Pyramid of Giza and Sphinx at golden hour",
      title: "Great Pyramid & Sphinx",
      description: "Marvel at the last remaining Wonder of the Ancient World"
    },
    {
      url: "/image/DISCOVER EGYPT/Islamic Cairo.jpg",
      alt: "Islamic Cairo with historic mosques and minarets",
      title: "Islamic Cairo Heritage",
      description: "Explore 1000 years of Islamic architecture"
    },
    {
      url: "/image/DISCOVER EGYPT/Khan el-Khalili.jpg",
      alt: "Khan el-Khalili bazaar with traditional lanterns and architecture",
      title: "Khan el-Khalili Bazaar",
      description: "Shop for authentic Egyptian treasures and crafts"
    }
  ];

  return (
    <div className="mb-16">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-96 overflow-hidden rounded-xl shadow-lg group">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 text-white p-6">
                  <h3 className="text-xl font-serif font-medium mb-2">{image.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">{image.description}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="relative static left-0 right-0 translate-y-0 mx-2" />
          <CarouselNext className="relative static left-0 right-0 translate-y-0 mx-2" />
        </div>
      </Carousel>
    </div>
  );
};

export default CityCarousel;
