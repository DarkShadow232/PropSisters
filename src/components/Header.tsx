import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, Heart, ChevronDown, Palette, Home, Crown } from "lucide-react";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import RoleGuard from "./auth/RoleGuard";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Add scroll effect with debounce for better performance
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        const offset = window.scrollY;
        if (offset > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }, 10); // Small timeout for debounce
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
        : 'bg-white/90 py-4'} border-b border-border/40 w-full`}
    >
      <div className="container-custom">
        <div className="flex items-center w-full">
          {/* Logo on the far left */}
          <div className="flex-shrink-0 mr-8">
            <Logo size={scrolled ? "small" : "medium"} />
          </div>
          {/* Navigation and actions side by side */}
          <div className="flex flex-1 items-center justify-between">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-row items-center justify-center flex-1 space-x-1">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
              <NavLink to="/rentals" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Browse Rentals
              </NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger className={`nav-link ${location.pathname === '/finish-request' || location.pathname === '/add-property' ? 'active' : ''} flex items-center gap-1`}>
                  Design Services
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56 bg-white shadow-md rounded-md p-1">
                  <RoleGuard allowedRoles={['user', 'owner', 'admin']}>
                    <DropdownMenuItem asChild>
                      <Link to="/finish-request" className="dropdown-menu-item flex items-center gap-2">
                        <Palette size={16} className="text-[#b94a3b]" />
                        <span>Interior Design</span>
                      </Link>
                    </DropdownMenuItem>
                  </RoleGuard>
                  <RoleGuard allowedRoles={['owner', 'admin']}>
                    <DropdownMenuItem asChild>
                      <Link to="/add-property" className="dropdown-menu-item flex items-center gap-2">
                        <Home size={16} className="text-[#b94a3b]" />
                        <span>Add Your Property</span>
                      </Link>
                    </DropdownMenuItem>
                  </RoleGuard>
                </DropdownMenuContent>
              </DropdownMenu>
              <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Our Services
              </NavLink>
              <RoleGuard allowedRoles={['user', 'owner', 'admin']}>
                <NavLink to="/property-sisters-club" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} flex items-center gap-1`}>
                  <Crown size={16} className="text-[#b94a3b]" />
                  Sisters Club
                </NavLink>
              </RoleGuard>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                About Us
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
              {/* User Dashboard Link */}
              <RoleGuard allowedRoles={['user', 'owner', 'admin']}>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link flex items-center gap-1 ${isActive ? 'active' : ''}`}> 
                  <User size={16} />
                  <span>Dashboard</span>
                </NavLink>
              </RoleGuard>
            </nav>
            {/* Auth buttons and icons */}
            <div className="hidden md:flex items-center gap-3">
              <button className="p-2 text-foreground/70 hover:text-[#b94a3b] transition-colors" aria-label="Search">
                <Search size={20} />
              </button>
              <button className="p-2 text-foreground/70 hover:text-[#b94a3b] transition-colors" aria-label="Favorites">
                <Heart size={20} />
              </button>
              <div className="h-6 w-px bg-border/50 mx-1"></div>
              {/* Show dashboard link in place of sign in/up if logged in */}
              {currentUser ? null : (
                <>
              <Link to="/sign-in">
                <Button variant="outline" size="sm" className="btn-outline gap-2">
                  <User size={16} />
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="sm" className="bg-[#b94a3b] hover:bg-[#9a3f33] text-white">Sign Up</Button>
              </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden overflow-hidden">
            <nav className="py-4 animate-fadeIn">
              <div className="flex flex-col space-y-3">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `py-3 px-2 border-b border-border/50 flex items-center ${isActive ? 'text-[#b94a3b] font-medium' : 'text-foreground/80'}`}
                  end
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/rentals" 
                  className={({ isActive }) => `py-3 px-2 border-b border-border/50 flex items-center ${isActive ? 'text-[#b94a3b] font-medium' : 'text-foreground/80'}`}
                >
                  Browse Rentals
                </NavLink>
                <div className="py-3 px-2 border-b border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${location.pathname === '/finish-request' || location.pathname === '/add-property' ? 'text-[#b94a3b] font-medium' : 'text-foreground/80'}`}>
                      Design Services
                    </span>
                    <ChevronDown size={16} className="text-foreground/60" />
                  </div>
                  <div className="pl-4 flex flex-col space-y-2 mt-2">
                    <RoleGuard allowedRoles={['user', 'owner', 'admin']}>
                      <Link 
                        to="/finish-request" 
                        className={`py-2 px-2 flex items-center gap-2 rounded-md ${location.pathname === '/finish-request' ? 'text-[#b94a3b] font-medium bg-secondary/50' : 'text-foreground/80 hover:bg-secondary/30'}`}
                      >
                        <Palette size={16} className="text-[#b94a3b]" />
                        Interior Design
                      </Link>
                    </RoleGuard>
                    <RoleGuard allowedRoles={['owner', 'admin']}>
                      <Link 
                        to="/add-property" 
                        className={`py-2 px-2 flex items-center gap-2 rounded-md ${location.pathname === '/add-property' ? 'text-[#b94a3b] font-medium bg-secondary/50' : 'text-foreground/80 hover:bg-secondary/30'}`}
                      >
                        <Home size={16} className="text-[#b94a3b]" />
                        Add Your Property
                      </Link>
                    </RoleGuard>
                  </div>
                </div>
                <NavLink 
                  to="/services" 
                  className={({ isActive }) => `py-3 px-2 border-b border-border/50 flex items-center ${isActive ? 'text-[#b94a3b] font-medium' : 'text-foreground/80'}`}
                >
                  Our Services
                </NavLink>
                <RoleGuard allowedRoles={['user', 'owner', 'admin']}>
                  <NavLink 
                    to="/property-sisters-club" 
                    className={({ isActive }) => `py-3 px-2 border-b border-border/50 flex items-center gap-2 ${isActive ? 'text-[#b94a3b] font-medium' : 'text-foreground/80'}`}
                  >
                    <Crown size={16} className="text-[#b94a3b]" />
                    Property Sisters Club
                  </NavLink>
                </RoleGuard>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `py-3 px-2 border-b border-border/50 flex items-center ${isActive ? 'text-[#b94a3b] font-medium' : 'text-foreground/80'}`}
                >
                  About Us
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => `py-3 px-2 border-b border-border/50 flex items-center ${isActive ? 'text-[#b94a3b] font-medium' : 'text-foreground/80'}`}
                >
                  Contact
                </NavLink>
                {/* User Dashboard Link (Mobile) */}
                <RoleGuard allowedRoles={['user', 'owner', 'admin']}>
                  <NavLink to="/dashboard" className={({ isActive }) => `py-3 px-2 border-b border-border/50 flex items-center gap-2 ${isActive ? 'text-[#b94a3b] font-medium bg-secondary/50' : 'text-foreground/80 hover:bg-secondary/30'}`}> 
                    <User size={16} />
                    <span>Dashboard</span>
                  </NavLink>
                </RoleGuard>
                {/* Mobile action buttons */}
                {!currentUser && (
                  <>
                    <Link to="/sign-in" className="py-3 px-2 flex items-center gap-2 border-b border-border/50 text-foreground/80 hover:bg-secondary/30">
                      <User size={16} />
                      Sign In
                  </Link>
                    <Link to="/sign-up" className="py-3 px-2 flex items-center gap-2 border-b border-border/50 text-foreground/80 hover:bg-secondary/30">
                      Sign Up
                  </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
