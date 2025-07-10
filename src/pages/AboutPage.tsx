
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="bg-beige-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3')" }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>

        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
              About Property Sisters the World
            </h1>
            <p className="text-lg opacity-90">
              Your premium platform for apartment rentals with on-demand interior design services.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Our Story</h2>
              <p className="text-foreground/80 mb-4">
                Property Sisters the World was founded in 2020 by two sisters, Emma and Olivia Parker, who shared a passion for interior design and real estate. Having worked in the design industry for over a decade, they identified a gap in the market for high-quality apartment rentals that also offered professional design services.
              </p>
              <p className="text-foreground/80 mb-4">
                Their vision was to create a platform where people could not only find beautiful spaces to stay but also personalize their living environment, whether for a short vacation or a longer-term residence.
              </p>
              <p className="text-foreground/80">
                Today, Property Sisters the World operates in major cities across the globe, with a curated selection of premium apartments and a team of talented designers ready to transform any space into a personalized home.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Property Sisters Office" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Our Mission & Values</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We're committed to creating beautiful, functional spaces that enhance the rental experience and make our clients feel at home wherever they are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-beige-50 p-8 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white font-medium">1</div>
              <h3 className="font-serif text-xl font-medium mb-3">Quality First</h3>
              <p className="text-foreground/70">
                We curate only the finest properties and work with top-tier designers to ensure exceptional quality in everything we do.
              </p>
            </div>

            <div className="bg-beige-50 p-8 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white font-medium">2</div>
              <h3 className="font-serif text-xl font-medium mb-3">Personalized Experience</h3>
              <p className="text-foreground/70">
                We believe your living space should reflect your unique style and preferences, whether you're staying for a day or a year.
              </p>
            </div>

            <div className="bg-beige-50 p-8 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white font-medium">3</div>
              <h3 className="font-serif text-xl font-medium mb-3">Exceptional Service</h3>
              <p className="text-foreground/70">
                Our dedicated team is committed to providing outstanding customer service and support at every step of your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title mb-12">Our Leadership Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 bg-beige-200">
                <div className="w-full h-full bg-beige-300"></div>
              </div>
              <h3 className="font-serif text-xl font-medium">Emma Parker</h3>
              <p className="text-primary mb-2">Co-Founder & CEO</p>
              <p className="text-foreground/70 text-sm">
                Interior design expert with over 15 years of experience in luxury properties.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 bg-beige-200">
                <div className="w-full h-full bg-beige-300"></div>
              </div>
              <h3 className="font-serif text-xl font-medium">Olivia Parker</h3>
              <p className="text-primary mb-2">Co-Founder & COO</p>
              <p className="text-foreground/70 text-sm">
                Real estate professional specializing in luxury rentals and property management.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 bg-beige-200">
                <div className="w-full h-full bg-beige-300"></div>
              </div>
              <h3 className="font-serif text-xl font-medium">Daniel Chen</h3>
              <p className="text-primary mb-2">Head of Design</p>
              <p className="text-foreground/70 text-sm">
                Award-winning interior designer with a passion for creating functional, beautiful spaces.
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 bg-beige-200">
                <div className="w-full h-full bg-beige-300"></div>
              </div>
              <h3 className="font-serif text-xl font-medium">Sarah Johnson</h3>
              <p className="text-primary mb-2">Customer Experience</p>
              <p className="text-foreground/70 text-sm">
                Dedicated to ensuring every client receives exceptional service from beginning to end.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-beige-100">
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6 max-w-3xl mx-auto">
            Ready to experience our exceptional services?
          </h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            Whether you're looking for a stylish rental or want to transform your space, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rentals">
              <Button size="lg" className="btn-primary min-w-[180px]">
                Browse Rentals
              </Button>
            </Link>
            <Link to="/finish-request">
              <Button size="lg" variant="outline" className="btn-outline min-w-[180px]">
                Request Design
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
