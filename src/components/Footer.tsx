
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Heart } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 text-foreground">
      {/* Newsletter Section */}
      <div className="bg-primary/10 py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-white rounded-xl shadow-md">
            <div className="text-center md:text-left max-w-md">
              <h3 className="font-serif text-2xl font-medium mb-2">Stay Updated</h3>
              <p className="text-foreground/70">Subscribe to our newsletter for the latest property listings and design tips.</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="form-input px-4 py-2 rounded-md min-w-[250px]"
              />
              <Button className="btn-primary whitespace-nowrap">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand and description */}
          <div className="space-y-6">
            <div className="mb-4 flex justify-center md:justify-start">
              <Logo size="medium" withTagline={true} />
            </div>
            <p className="text-sm text-foreground/70 max-w-xs text-center md:text-left">
              Your premium platform for apartment rentals with on-demand interior design services to make any space feel like home.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300" 
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300" 
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-lg font-medium mb-6 relative inline-block after:content-[''] after:absolute after:w-10 after:h-0.5 after:bg-primary after:bottom-0 after:left-0 after:-mb-2">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/rentals" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Browse Rentals</Link>
              <Link to="/finish-request" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Submit Finish Request</Link>
              <Link to="/services" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Our Services</Link>
              <Link to="/about" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">About Us</Link>
              <Link to="/contact" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Contact</Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-lg font-medium mb-6 relative inline-block after:content-[''] after:absolute after:w-10 after:h-0.5 after:bg-primary after:bottom-0 after:left-0 after:-mb-2">Legal</h3>
            <nav className="flex flex-col space-y-3">
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Terms of Service</Link>
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Privacy Policy</Link>
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Cookie Policy</Link>
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Accessibility</Link>
              <Link to="#" className="text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">Sitemap</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-lg font-medium mb-6 relative inline-block after:content-[''] after:absolute after:w-10 after:h-0.5 after:bg-primary after:bottom-0 after:left-0 after:-mb-2">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                  <Mail size={16} />
                </div>
                <span className="text-foreground/70">info@propertysisters.world</span>
              </div>
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                  <Phone size={16} />
                </div>
                <span className="text-foreground/70">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                  <MapPin size={16} />
                </div>
                <span className="text-foreground/70">Cairo, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} Property Sisters the World. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <Heart size={14} className="text-primary mx-1" /> by Property Sisters
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
