import React from "react";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  color?: string;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 16,
  color = "#FFB800",
  className = "",
}) => {
  // Convert rating to stars (full, half, empty)
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          fill={color}
          stroke={color}
          className="mr-0.5"
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <StarHalf
          key="half"
          size={size}
          fill={color}
          stroke={color}
          className="mr-0.5"
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          fill="transparent"
          stroke={color}
          className="mr-0.5"
        />
      ))}
    </div>
  );
};

export default StarRating;
