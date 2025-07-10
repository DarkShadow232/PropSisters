import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-beige-50 to-beige-100">
      <div className="w-full max-w-md text-center px-4 animate-fade-in-up">
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl font-serif font-bold text-primary/20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-primary animate-pulse-soft" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-serif font-medium mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">We couldn't find the page you were looking for. It might have been moved or doesn't exist.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90 gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/rentals">
              <ArrowLeft className="h-4 w-4" />
              Browse Rentals
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
