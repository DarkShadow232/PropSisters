import React, { useState, useMemo } from "react";
import { Review, getReviewsByPropertyId, getAverageRating, getRatingDistribution } from "@/data/reviewsData";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Star } from "lucide-react";

interface ReviewsListProps {
  propertyId: number;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest" | "helpful";

const ReviewsList: React.FC<ReviewsListProps> = ({ propertyId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Get reviews and stats
  const allReviews = getReviewsByPropertyId(propertyId);
  const averageRating = getAverageRating(propertyId);
  const ratingDistribution = getRatingDistribution(propertyId);

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...allReviews];

    // Filter by rating
    if (ratingFilter !== null) {
      result = result.filter((review) => review.rating === ratingFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (review) =>
          review.title.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          review.userName.toLowerCase().includes(query)
      );
    }

    // Sort reviews
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "highest":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        result.sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return result;
  }, [allReviews, ratingFilter, searchQuery, sortBy]);

  // Calculate total reviews for each rating
  const totalReviews = allReviews.length;

  // Calculate percentages for rating distribution
  const ratingPercentages = useMemo(() => {
    return Object.entries(ratingDistribution).map(([rating, count]) => ({
      rating: Number(rating),
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    }));
  }, [ratingDistribution, totalReviews]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-serif font-medium mb-4">Guest Reviews</h2>

      {/* Reviews summary */}
      <div className="bg-white border border-border/40 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Average rating */}
          <div className="text-center md:text-left md:border-r md:border-border/40 md:pr-6 md:mr-2">
            <div className="text-4xl font-medium text-[#b94a3b]">{averageRating}</div>
            <StarRating rating={averageRating} size={20} className="justify-center md:justify-start my-2" />
            <div className="text-sm text-muted-foreground">{totalReviews} reviews</div>
          </div>

          {/* Rating distribution */}
          <div className="flex-1">
            <div className="space-y-2">
              {ratingPercentages
                .sort((a, b) => b.rating - a.rating)
                .map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-12 text-sm font-medium">{rating} stars</div>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <div className="w-10 text-sm text-right text-muted-foreground">
                      {count}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter size={16} />
              <span>Filters</span>
            </Button>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="highest">Highest rating</SelectItem>
                <SelectItem value="lowest">Lowest rating</SelectItem>
                <SelectItem value="helpful">Most helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 p-4 border border-border/40 rounded-lg bg-secondary/30">
            <h3 className="text-sm font-medium mb-3">Filter by rating</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={ratingFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setRatingFilter(null)}
                className={ratingFilter === null ? "bg-[#b94a3b] hover:bg-[#a03e30]" : ""}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={ratingFilter === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRatingFilter(rating)}
                  className={`flex items-center gap-1 ${
                    ratingFilter === rating ? "bg-[#b94a3b] hover:bg-[#a03e30]" : ""
                  }`}
                >
                  {rating} <Star size={12} className="ml-1" fill={ratingFilter === rating ? "white" : "#FFB800"} />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews list */}
      <div>
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-8 border border-border/40 rounded-lg bg-secondary/20">
            <p className="text-muted-foreground">
              {totalReviews > 0
                ? "No reviews match your filters. Try adjusting your search criteria."
                : "This property doesn't have any reviews yet."}
            </p>
          </div>
        )}
      </div>

      {/* Add review button */}
      <div className="mt-8 text-center">
        <Button className="bg-[#b94a3b] hover:bg-[#a03e30] text-white">
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default ReviewsList;
