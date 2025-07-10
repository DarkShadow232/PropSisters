import React, { useState } from "react";
import ReviewsList from "./ReviewsList";
import ReviewForm from "./ReviewForm";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ReviewsProps {
  propertyId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ propertyId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // In a real app, we would refresh the reviews list here
  };

  return (
    <div className="mt-10">
      <div className="border-t border-border/40 pt-8">
        {showReviewForm ? (
          <ReviewForm
            propertyId={propertyId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        ) : (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-medium">Guest Reviews</h2>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-[#b94a3b] hover:bg-[#a03e30] text-white flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Write a Review
            </Button>
          </div>
        )}

        {!showReviewForm && <ReviewsList propertyId={propertyId} />}
      </div>
    </div>
  );
};

export default Reviews;
