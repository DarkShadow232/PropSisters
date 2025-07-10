import React, { useState } from "react";
import { Review } from "@/data/reviewsData";
import StarRating from "./StarRating";
import { ThumbsUp, CornerDownRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [reported, setReported] = useState(false);

  const handleHelpfulClick = () => {
    if (!isHelpful) {
      setHelpfulCount(helpfulCount + 1);
      setIsHelpful(true);
    } else {
      setHelpfulCount(helpfulCount - 1);
      setIsHelpful(false);
    }
  };

  const handleReportClick = () => {
    setReported(true);
  };

  // Format date
  const formattedDate = format(new Date(review.date), "MMM d, yyyy");
  const responseDate = review.response ? format(new Date(review.response.date), "MMM d, yyyy") : null;

  return (
    <div className="border border-border/40 rounded-lg p-5 mb-6 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* User avatar */}
        <div className="flex-shrink-0">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        {/* Review content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="font-medium text-lg">{review.userName}</h3>
            <div className="text-sm text-muted-foreground mt-1 sm:mt-0">
              {formattedDate}
            </div>
          </div>

          <div className="mb-2">
            <StarRating rating={review.rating} size={18} />
          </div>

          <h4 className="font-medium text-base mb-2">{review.title}</h4>
          <p className="text-foreground/80 mb-4">{review.comment}</p>

          {/* Host response */}
          {review.response && (
            <div className="bg-secondary/30 rounded-lg p-4 mb-4 border-l-2 border-[#b94a3b]">
              <div className="flex items-center gap-2 mb-2">
                <CornerDownRight size={16} className="text-[#b94a3b]" />
                <div>
                  <span className="font-medium">{review.response.from}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {responseDate}
                  </span>
                </div>
              </div>
              <p className="text-foreground/80 pl-6">{review.response.comment}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpfulClick}
              className={`text-sm flex items-center gap-1 ${
                isHelpful ? "text-[#b94a3b]" : "text-muted-foreground"
              }`}
            >
              <ThumbsUp size={14} />
              <span>Helpful</span>
              <span className="ml-1">({helpfulCount})</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReportClick}
              disabled={reported}
              className="text-sm flex items-center gap-1 text-muted-foreground"
            >
              <Flag size={14} />
              <span>{reported ? "Reported" : "Report"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
