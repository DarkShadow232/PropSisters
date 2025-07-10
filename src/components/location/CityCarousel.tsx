
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
      url: "https://images.unsplash.com/photo-1568755133102-8b5f8e07361f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "Cairo cityscape showing the beautiful Nile River and modern buildings",
      title: "Modern Cairo Skyline"
    },
    {
      url: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "The majestic Pyramids of Giza during sunset",
      title: "Pyramids of Giza"
    },
    {
      url: "https://images.unsplash.com/photo-1559738933-667709157f5c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "Grand Egyptian Museum exterior showcasing modern architecture",
      title: "Grand Egyptian Museum"
    },
    {
      url: "https://images.unsplash.com/photo-1601339434503-8e842e174609?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "Khan el-Khalili bazaar with traditional lanterns and architecture",
      title: "Khan el-Khalili Bazaar"
    }
  ];

  return (
    <div className="mb-16">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-96 overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                  <h3 className="text-lg font-medium">{image.title}</h3>
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
