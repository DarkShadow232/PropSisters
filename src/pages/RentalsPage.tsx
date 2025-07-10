import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ApartmentDetailModal from "@/components/ApartmentDetailModal";
import FilterSidebar from "@/components/rentals/FilterSidebar";
import MobileFilter from "@/components/rentals/MobileFilter";
import SearchBar from "@/components/rentals/SearchBar";
import SortResults from "@/components/rentals/SortResults";
import ApartmentCard from "@/components/rentals/ApartmentCard";
import { rentals } from "@/data/rentalData";
import { Apartment } from "@/data/rentalData";

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

  // Limit to only 9 apartments
  const limitedRentals = rentals.slice(0, 9);
  
  // Calculate pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(limitedRentals.length / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = limitedRentals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
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

  // Find the selected apartment from the rentals array
  const selectedApartmentData = rentals.find(rental => rental.id === selectedApartment) || null;

  return (
    <div className="bg-beige-50 min-h-screen">
      <div className="container-custom py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">Browse Rentals</h1>
        <p className="text-foreground/70 mb-8">
          Find your perfect apartment from our curated selection of premium rentals.
        </p>

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
              <Button 
                variant="outline"
                className="hidden md:flex items-center gap-2"
                onClick={() => navigate(`/rentals/${limitedRentals[0]?.id || 1}`)}
              >
                View Property Details
              </Button>
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
