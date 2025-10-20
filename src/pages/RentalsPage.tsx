import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ApartmentDetailModal from "@/components/ApartmentDetailModal";
import FilterSidebar from "@/components/rentals/FilterSidebar";
import MobileFilter from "@/components/rentals/MobileFilter";
import SearchBar from "@/components/rentals/SearchBar";
import SortResults from "@/components/rentals/SortResults";
import ApartmentCard from "@/components/rentals/ApartmentCard";
import { Apartment } from "@/data/rentalData";
import { useProperties } from "@/hooks/useProperties";
import { RefreshCw } from "lucide-react";

const RentalsPage = () => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([100, 500]);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedApartment, setSelectedApartment] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch properties from MongoDB (optimized - no polling)
  const { properties, loading, error, lastFetch, refetch } = useProperties({
    pollInterval: 0, // Polling disabled for better performance
    filters: {
      limit: 100, // Fetch all properties
    },
  });

  // Use fetched properties
  const limitedRentals = properties;
  
  // Calculate pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(limitedRentals.length / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = limitedRentals.slice(indexOfFirstItem, indexOfLastItem);

  // Sync current page from URL on mount and whenever the URL changes
  useEffect(() => {
    const raw = searchParams.get("page");
    const parsed = Number.parseInt(raw || "1", 10);
    const clamped = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), Math.max(totalPages, 1)) : 1;
    if (clamped !== currentPage) {
      setCurrentPage(clamped);
    }
  }, [searchParams, totalPages]);

  // Update URL when page changes via UI
  const handlePageChange = (pageNumber: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(pageNumber));
    setSearchParams(next);
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDetails = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleViewDetails = (apartmentId: number) => {
    setSelectedApartment(apartmentId);
    setIsDetailModalOpen(true);
  };

  const handleBookNow = (apartmentId: number) => {
    toast({
      title: "Booking Initiated",
      description: `You've started the booking process for apartment #${apartmentId}. This functionality will be implemented soon.`,
    });
    setIsDetailModalOpen(false);
  };

  // Find the selected apartment from the properties array
  const selectedApartmentData = properties.find(rental => rental.id === selectedApartment) || null;

  // Show loading state
  if (loading && properties.length === 0) {
    return (
      <div className="bg-beige-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading properties from database...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && properties.length === 0) {
    return (
      <div className="bg-beige-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Properties</h2>
          <p className="text-foreground/70 mb-4">{error}</p>
          <p className="text-sm text-foreground/60 mb-4">
            Please make sure the admin console backend is running on port 3000.
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-beige-50 min-h-screen">
      <div className="container-custom py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Browse Rentals</h1>
          <p className="text-foreground/70">Find your perfect apartment from our curated selection of premium rentals.</p>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          {/* Search & Filter on Mobile */}
          <MobileFilter />

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar 
              priceRange={priceRange} 
              setPriceRange={setPriceRange} 
            />
          </div>

          {/* Main Content - Rental Listings */}
          <div className="lg:col-span-3">
            {/* Desktop Search Bar */}
            <div className="hidden lg:flex">
              <SearchBar />
            </div>

            {/* Results Count & Sort */}
            <div className="flex justify-between items-center mb-6">
              <SortResults resultsCount={limitedRentals.length} />
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                {lastFetch && (
                  <span className="text-xs text-foreground/50 flex items-center">
                    Last updated: {lastFetch.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentItems.map((rental) => (
                <ApartmentCard
                  key={rental.id}
                  rental={rental}
                  expandedCardId={expandedCardId}
                  toggleDetails={toggleDetails}
                  handleViewDetails={handleViewDetails}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10">
              <div className="flex space-x-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m15 18-6-6 6-6"></path>
                  </svg>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button 
                    key={page}
                    variant="outline" 
                    className={currentPage === page ? "bg-primary text-white border-primary" : ""}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apartment Detail Modal */}
      <ApartmentDetailModal
        apartment={selectedApartmentData}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default RentalsPage;
