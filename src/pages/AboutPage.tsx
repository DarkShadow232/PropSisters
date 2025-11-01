
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
              About Property Sisters
            </h1>
            <p className="text-lg opacity-90">
              A heartfelt hospitality project born from the shared vision of two sisters.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8 text-center">Our Story</h2>
            
            <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
              <p>
                Property Sisters is more than just a hospitality brand — it's a heartfelt project born from the shared vision of two sisters, <span className="font-medium text-primary">Basma</span> and <span className="font-medium text-primary">Yasmina</span>, who combined their strengths to create something truly special.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-serif text-xl font-medium mb-3 text-primary">Basma's Vision</h3>
                  <p className="text-foreground/80">
                    From early on, Basma had a deep passion for interior design. She was always eager to upgrade and transform the family properties in Madinaty, ensuring each apartment reflected style, warmth, and attention to detail. Her dedication to creating beautiful, functional spaces became the foundation of the Property Sisters experience.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-serif text-xl font-medium mb-3 text-primary">Yasmina's Dream</h3>
                  <p className="text-foreground/80">
                    Meanwhile, Yasmina had dreamed since childhood of owning or managing a hotel. Hospitality was always close to her heart — not just offering a place to stay, but crafting meaningful experiences for guests. She imagined a space where people could feel truly at home, welcomed with care and quality.
                  </p>
                </div>
              </div>

              <p className="text-center text-xl font-medium text-primary">
                Together, they turned that dream into reality.
              </p>

              <p>
                At Property Sisters, we offer fully furnished, thoughtfully designed hotel apartments tailored for families and couples. We believe in quiet, respectful stays — and we proudly host only married couples or families with formal agreements.
              </p>

              <div className="bg-beige-50 p-6 rounded-lg border-l-4 border-primary">
                <p className="text-foreground/70 italic text-center">
                  What started as a family project has grown into a trusted hospitality brand — built on design, trust, and genuine care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Our Services</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Designed for comfort and convenience, we offer a seamless hospitality experience from booking to check-out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-beige-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Online Contracts</h3>
              <p className="text-foreground/70 text-sm">
                Secure online contract signing and payment processing for your peace of mind.
              </p>
            </div>

            <div className="bg-beige-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Seamless Check-In</h3>
              <p className="text-foreground/70 text-sm">
                Easy, hassle-free check-in process to get you settled quickly and comfortably.
              </p>
            </div>

            <div className="bg-beige-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Prime Locations</h3>
              <p className="text-foreground/70 text-sm">
                Elegant, cozy apartments in Madinaty's most sought-after locations.
              </p>
            </div>

            <div className="bg-beige-50 p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Optional Services</h3>
              <p className="text-foreground/70 text-sm">
                In-apartment services like cleaning available upon request during your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leadership */}
      <section className="py-16 bg-gradient-to-br from-beige-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Our Leadership</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Meet the sisters behind Property Sisters — combining passion for design and hospitality to create exceptional experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Basma */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-medium mb-2">Basma</h3>
                <p className="text-primary font-medium mb-4">Co-Founder & Design Director</p>
                <div className="h-1 w-16 bg-primary mx-auto mb-4 rounded-full"></div>
                <p className="text-foreground/80 leading-relaxed">
                  Interior design expert with a passion for transforming spaces into warm, stylish homes. Basma brings her keen eye for detail and dedication to creating beautiful, functional apartments that guests love.
                </p>
              </div>
            </div>

            {/* Yasmina */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-medium mb-2">Yasmina</h3>
                <p className="text-primary font-medium mb-4">Co-Founder & Hospitality Manager</p>
                <div className="h-1 w-16 bg-primary mx-auto mb-4 rounded-full"></div>
                <p className="text-foreground/80 leading-relaxed">
                  Hospitality professional with a lifelong dream of creating memorable guest experiences. Yasmina ensures every stay is welcoming, comfortable, and exceeds expectations with genuine care and attention.
                </p>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="text-center mt-12">
            <p className="text-foreground/60 text-lg mb-2">Warmest regards,</p>
            <p className="font-serif text-2xl text-primary font-medium">Basma & Yasmina</p>
            <p className="text-foreground/60">Co-Founders, Property Sisters</p>
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
