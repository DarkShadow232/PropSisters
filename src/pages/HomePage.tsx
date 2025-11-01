import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Paintbrush, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LocationGuide from "@/components/LocationGuide";
import VisitorTips from "@/components/VisitorTips";
import ServicesGrid from "@/components/ServicesGrid";
import SpecialOffers from "@/components/SpecialOffers";
import { toast } from "sonner";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check for Google OAuth callback success
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleAuth = params.get('google_auth');
    const errorParam = params.get('error');

    if (googleAuth === 'success') {
      toast.success("Successfully signed in with Google!", {
        description: "Welcome to Sisterhood Style Rentals!"
      });
      // Clean up URL
      window.history.replaceState({}, '', location.pathname);
    } else if (errorParam) {
      const errorMessages: Record<string, string> = {
        google_auth_failed: "Google sign-in failed. Please try again.",
        session_error: "Session error occurred. Please try again.",
        auth_error: "Authentication error occurred. Please try again."
      };
      toast.error(errorMessages[errorParam] || "An error occurred during sign-in");
      // Clean up URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);
  
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
              Discover luxury apartments in Cairo's most prestigious neighborhoods. From Nile views to modern amenities, experience Egypt's capital in style with our premium rental properties.
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
              <span className="text-rustic-600 text-sm font-medium tracking-wide">PREMIUM CAIRO RENTALS</span>
              <h2 className="text-3xl font-serif font-medium text-charcoal-800 mt-1">Exclusive Properties</h2>
              
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
              <div className="relative overflow-hidden rounded-lg img-hover-zoom h-64">
                <img 
                  src="/image/Apartments/Ap6/IMG-20250327-WA0070.jpg" 
                  alt="Luxury Two-Bedroom Apartment with Two Bathrooms" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute top-4 left-4 bg-rustic-600 text-white py-1 px-3 rounded-full text-sm font-medium">
                  Featured
                </div>
                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium shadow-md">
                  2500 EGP / night
                </div>
              </div>
              <div className="p-4 hover-lift">
                <h3 className="font-serif text-lg font-medium mb-2">Luxury Two-Bedroom Apartment with Two Bathrooms</h3>
                <p className="text-foreground/70 text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"></path>
                  </svg>
                  Madinaty, Egypt - Building B6, Group 68
                </p>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">2 Bedrooms</span>
                  <span className="text-foreground/70">2 Baths</span>
                </div>
                <Separator className="my-3" />
                <Button 
                  className="w-full btn-primary mt-2"
                  onClick={() => navigate('/rentals/6')}
                >
                  View Details
                </Button>
              </div>
            </div>

            {/* Property Card 2 */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="relative overflow-hidden rounded-lg img-hover-zoom h-64">
                <img 
                  src="/image/Apartments/Ap1/IMG-20250327-WA0009.jpg" 
                  alt="Premium Two-Bedroom Garden View Apartment - Building B6" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium">
                  3000 EGP / night
                </div>
              </div>
              <div className="p-4 hover-lift">
                <h3 className="font-serif text-lg font-medium mb-2">Premium Two-Bedroom Garden View Apartment - Building B6</h3>
                <p className="text-foreground/70 text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"></path>
                  </svg>
                  Madinaty, Egypt - Building B6, Group 65
                </p>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">2 Bedrooms</span>
                  <span className="text-foreground/70">1 Bath</span>
                </div>
                <Separator className="my-3" />
                <Button 
                  className="w-full btn-primary mt-2"
                  onClick={() => navigate('/rentals/1')}
                >
                  View Details
                </Button>
              </div>
            </div>

            {/* Property Card 3 */}
            <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="relative overflow-hidden rounded-lg img-hover-zoom h-64">
                <img 
                  src="/image/Apartments/Ap2/IMG-20250327-WA0020.jpg" 
                  alt="Modern Two-Bedroom Apartment, Fifth Floor" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium">
                  3000 EGP / night
                </div>
              </div>
              <div className="p-4 hover-lift">
                <h3 className="font-serif text-lg font-medium mb-2">Modern Two-Bedroom Apartment, Fifth Floor</h3>
                <p className="text-foreground/70 text-sm mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"></path>
                  </svg>
                  Madinaty, Egypt - Building B11, Group 113
                </p>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">2 Bedrooms</span>
                  <span className="text-foreground/70">1 Bath</span>
                </div>
                <Separator className="my-3" />
                <Button 
                  className="w-full btn-primary mt-2"
                  onClick={() => navigate('/rentals/2')}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Egypt Tourism Highlights */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 reveal-on-scroll">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-amber-600 text-sm font-medium tracking-wide">DISCOVER EGYPT</span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-charcoal-800 mt-2 mb-6">Iconic Egyptian Landmarks</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              From ancient wonders to vibrant culture, explore Egypt's most treasured destinations just moments from your luxury rental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Pyramids of Giza */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/image/DISCOVER EGYPT/Pyramids of Giza.jpg" 
                  alt="Great Pyramid of Giza and Sphinx" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  UNESCO World Heritage
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-medium mb-3 text-charcoal-800">Pyramids of Giza</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Marvel at the last remaining Wonder of the Ancient World. The Great Pyramid, built over 4,500 years ago, stands as a testament to ancient Egyptian engineering mastery.
                </p>
                <div className="flex items-center text-amber-600 text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  35 minutes from city center
                </div>
              </div>
            </div>

            {/* Khan el-Khalili */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/image/DISCOVER EGYPT/Khan el-Khalili.jpg" 
                  alt="Khan el-Khalili bazaar with traditional architecture" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Historic Bazaar
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-medium mb-3 text-charcoal-800">Khan el-Khalili</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Immerse yourself in Cairo's most famous bazaar, where traditional crafts, spices, and treasures have been traded for over 600 years in this vibrant marketplace.
                </p>
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  25 minutes from downtown
                </div>
              </div>
            </div>

            {/* Islamic Cairo */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/image/DISCOVER EGYPT/Islamic Cairo.jpg" 
                  alt="Islamic Cairo with historic mosques and minarets" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Cultural Heritage
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-medium mb-3 text-charcoal-800">Islamic Cairo</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Explore the world's largest collection of historic Islamic architecture, featuring magnificent mosques, madrasas, and monuments spanning 1,000 years.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  20 minutes from city center
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg">
              <div className="flex items-center gap-2 text-amber-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="font-medium">UNESCO World Heritage Sites</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-2 text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium">5000+ Years of History</span>
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
