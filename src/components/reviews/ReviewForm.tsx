import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewFormProps {
  propertyId: number;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  propertyId,
  onReviewSubmitted,
  onCancel,
}) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a review title");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter your review");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, you would submit the review to your backend
      // For this demo, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Review submitted successfully!", {
        description: "Thank you for sharing your experience.",
      });

      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-border/40 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-medium mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating">Your Rating</Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  size={24}
                  fill={
                    (hoverRating || rating) >= star ? "#FFB800" : "transparent"
                  }
                  stroke="#FFB800"
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 ? `${rating} star${rating !== 1 ? "s" : ""}` : "Select a rating"}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Review Title</Label>
          <Input
            id="title"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Review Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Your Review</Label>
          <Textarea
            id="comment"
            placeholder="Tell us about your stay, the property, and the location..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[120px]"
            required
          />
        </div>

        {/* User info notice */}
        {currentUser ? (
          <div className="text-sm text-muted-foreground">
            You are posting as{" "}
            <span className="font-medium">{currentUser.displayName || currentUser.email}</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            You need to <a href="/sign-in" className="text-[#b94a3b] hover:underline">sign in</a> to post a review
          </div>
        )}

        {/* Submit buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#b94a3b] hover:bg-[#a03e30] text-white"
            disabled={isSubmitting || !currentUser}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
