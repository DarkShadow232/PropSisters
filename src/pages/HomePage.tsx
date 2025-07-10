import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Paintbrush, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LocationGuide from "@/components/LocationGuide";
import VisitorTips from "@/components/VisitorTips";
import ServicesGrid from "@/components/ServicesGrid";
import SpecialOffers from "@/components/SpecialOffers";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transform scale-105 animate-subtle-zoom" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop&ixlib=rb-4.0.3')" }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl animate-slide-up space-y-6 px-4 sm:px-6 md:px-0 stagger-children revealed">
            <div className="space-y-2">
              <span className="inline-block text-[#b94a3b] bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium tracking-wide">PREMIUM CAIRO RENTALS</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                Your Rental. <span className="text-[#b94a3b]">Your Style.</span> Your Time.
              </h1>
            </div>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">
              Find your perfect apartment and make it truly yours with our design services. Experience Cairo like a local with our curated properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/rentals">
                <Button size="lg" className="bg-[#b94a3b] hover:bg-[#9a3f33] text-white font-medium px-6 py-6 h-auto w-full sm:w-auto">
                  <Search size={18} className="mr-2" />
                  Browse Rentals
                </Button>
              </Link>
              <Link to="/finish-request">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/30 w-full sm:w-auto px-6 py-6 h-auto">
                  <Paintbrush size={18} className="mr-2" />
                  Submit Design Request
                </Button>
              </Link>
            </div>
            <div className="pt-8 flex items-center space-x-4 text-sm opacity-75">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/women/${i+20}.jpg`} 
                      alt="Happy customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span>Join <strong>2,000+</strong> satisfied customers</span>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Properties */}
      <section className="py-20 bg-white reveal-on-scroll">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <span className="text-rustic-600 text-sm font-medium tracking-wide">HANDPICKED PROPERTIES</span>
              <h2 className="text-3xl font-serif font-medium text-charcoal-800 mt-1">Featured Properties</h2>
              <p className="text-gray-500 mt-2 max-w-2xl">Discover our selection of premium properties in Cairo's most desirable neighborhoods.</p>
            </div>
            <Link to="/rentals" className="text-rustic-600 hover:text-rustic-700 font-medium inline-flex items-center bg-rustic-50 hover:bg-rustic-100 px-4 py-2 rounded-full transition-colors">
              View All Properties
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {/* Property Card 1 */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="relative overflow-hidden rounded-lg img-hover-zoom">
                <img 
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Modern apartment in downtown" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-rustic-600 text-white py-1 px-3 rounded-full text-sm font-medium">
                  Featured
                </div>
                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium shadow-md">
                  $120 / night
                </div>
              </div>
              <div className="p-4 hover-lift">
                <h3 className="font-serif text-lg font-medium mb-2">Modern Downtown Apartment</h3>
                <p className="text-foreground/70 text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  New York, NY
                </p>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">2 Bedrooms</span>
                  <span className="text-foreground/70">1 Bath</span>
                </div>
                <Separator className="my-3" />
                <Button className="w-full btn-primary mt-2">View Details</Button>
              </div>
            </div>

            {/* Property Card 2 */}
            <div className="property-card group">
              <div className="relative overflow-hidden rounded-lg img-hover-zoom">
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Luxury penthouse with view" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium">
                  $350 / night
                </div>
              </div>
              <div className="p-4 hover-lift">
                <h3 className="font-serif text-lg font-medium mb-2">Luxury Penthouse with View</h3>
                <p className="text-foreground/70 text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Los Angeles, CA
                </p>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">3 Bedrooms</span>
                  <span className="text-foreground/70">2 Baths</span>
                </div>
                <Separator className="my-3" />
                <Button className="w-full btn-primary mt-2">View Details</Button>
              </div>
            </div>

            {/* Property Card 3 */}
            <div className="property-card group">
              <div className="relative overflow-hidden rounded-lg img-hover-zoom">
                <img 
                  src="https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Cozy studio in historic district" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium">
                  $90 / night
                </div>
              </div>
              <div className="p-4 hover-lift">
                <h3 className="font-serif text-lg font-medium mb-2">Cozy Studio in Historic District</h3>
                <p className="text-foreground/70 text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Boston, MA
                </p>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Studio</span>
                  <span className="text-foreground/70">1 Bath</span>
                </div>
                <Separator className="my-3" />
                <Button className="w-full btn-primary mt-2">View Details</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-beige-50 reveal-on-scroll">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">Our Services</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Experience the perfect blend of premium rentals and personalized services to make your stay exceptional.
            </p>
          </div>
          
          <ServicesGrid />
          
          <div className="mt-12 text-center">
            <Link to="/services">
              <Button size="lg" className="btn-primary">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location Guide Section */}
      <LocationGuide />

      {/* Visitor Tips Section */}
      <VisitorTips />

      {/* Special Offers Section */}
      <SpecialOffers />

      {/* CTA Section */}
      <section className="py-20 bg-beige-100 reveal-on-scroll">
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6 max-w-3xl mx-auto">
            Ready to transform your space into the perfect home?
          </h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Let our design experts help you create a space that reflects your personal style and meets your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/finish-request">
              <Button size="lg" className="btn-primary min-w-[180px] shimmer-effect">
                Request Design
              </Button>
            </Link>
            <Link to="/rentals">
              <Button size="lg" variant="outline" className="btn-outline min-w-[180px] hover-lift">
                Browse Rentals
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
