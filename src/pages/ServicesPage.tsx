import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Brush, Sofa, CheckCircle } from "lucide-react";

const ServicesPage = () => {
  return (
    <div className="bg-beige-50 min-h-screen">
      <div className="container-custom py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">Our Services</h1>
        <p className="text-foreground/70 mb-12 max-w-2xl">
          Property Sisters the World offers comprehensive interior design and rental services to make any space feel like home.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
            <div className="w-14 h-14 bg-beige-100 rounded-full flex items-center justify-center mb-6">
              <Building className="text-primary h-7 w-7" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-3">Full Interior Design</h3>
            <p className="text-foreground/70 mb-4">
              Complete design service including space planning, furniture selection, color schemes, accessories, and decor.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Personalized design concepts</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Space planning and layout optimization</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Furniture and decor selection</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Implementation and styling</span>
              </li>
            </ul>
            <Link to="/finish-request">
              <Button className="w-full">Request Service</Button>
            </Link>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
            <div className="w-14 h-14 bg-beige-100 rounded-full flex items-center justify-center mb-6">
              <Sofa className="text-primary h-7 w-7" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-3">Furniture Selection</h3>
            <p className="text-foreground/70 mb-4">
              Expert selection and sourcing of furniture pieces to match your space, style, and budget.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Custom furniture recommendations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Sourcing from trusted vendors</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Delivery and assembly coordination</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Budget-friendly options available</span>
              </li>
            </ul>
            <Link to="/finish-request">
              <Button className="w-full">Request Service</Button>
            </Link>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
            <div className="w-14 h-14 bg-beige-100 rounded-full flex items-center justify-center mb-6">
              <Brush className="text-primary h-7 w-7" />
            </div>
            <h3 className="font-serif text-xl font-medium mb-3">Painting & Fixes</h3>
            <p className="text-foreground/70 mb-4">
              Professional painting services, minor repairs, and cosmetic improvements for your space.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Color consultation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Professional painting services</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Minor repairs and maintenance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">Quick turnaround time</span>
              </li>
            </ul>
            <Link to="/finish-request">
              <Button className="w-full">Request Service</Button>
            </Link>
          </div>
        </div>

        {/* Rental Services */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-8">Rental Services</h2>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <h3 className="font-serif text-xl font-medium mb-3">Premium Apartment Rentals</h3>
                <p className="text-foreground/70 mb-6">
                  Choose from our curated selection of premium apartments in the most desirable locations. All our properties are carefully selected for quality, comfort, and style.
                </p>
                
                <h4 className="font-medium mb-2">Rental Periods</h4>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Daily - Perfect for short stays</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Weekly - Ideal for vacations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Monthly - Great for extended stays</span>
                  </li>
                </ul>
                
                <h4 className="font-medium mb-2">Additional Services</h4>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">On-demand housekeeping</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">Flexible check-in/check-out</span>
                  </li>
                </ul>
                
                <Link to="/rentals">
                  <Button className="btn-primary">Browse Rentals</Button>
                </Link>
              </div>
              
              <div className="bg-cover bg-center h-full min-h-[300px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')" }}>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-8">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-beige-200 mr-4"></div>
                <div>
                  <h4 className="font-medium">Emily Johnson</h4>
                  <p className="text-sm text-foreground/70">New York, NY</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "The design team at Property Sisters transformed my rental into a beautiful home. They understood my style perfectly and worked within my budget. I'm in love with my new space!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-beige-200 mr-4"></div>
                <div>
                  <h4 className="font-medium">Michael Rodriguez</h4>
                  <p className="text-sm text-foreground/70">Los Angeles, CA</p>
                </div>
              </div>
              <p className="text-foreground/80 italic">
                "I used their rental service for a month-long stay in LA. The apartment was exactly as pictured - clean, stylish, and in a great location. The customer service was exceptional too!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
