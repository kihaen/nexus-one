import { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface RatingProps {
  postId: string;
  initialRating?: number;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
}

export const RatingComponent: FC<RatingProps> = ({ postId, initialRating }) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [postId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/post/rating?postId=${postId}`);
      const data = await response.json();
      if (response.ok) {
        setRatingData(data);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleRatingSubmit = async (selectedRating: number) => {
    setRating(selectedRating);
    setShowReviewInput(true);
  };

  const handleReviewSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/post/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          rating,
          text: reviewText.trim() || null,
        }),
      });

      if (response.ok) {
        await fetchRatings();
        setShowReviewInput(false);
        setReviewText("");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className={`p-1 ${
              (hoveredRating || rating) >= star
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            disabled={isSubmitting}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRatingSubmit(star)}
          >
            ★
          </Button>
        ))}
      </div>

      {showReviewInput && (
        <div className="w-full max-w-md mt-2">
          <Textarea
            placeholder="Write your review (optional)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowReviewInput(false);
                setRating(0);
                setReviewText("");
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleReviewSubmit}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500">
        {ratingData.totalRatings > 0 ? (
          <>
            Average: {ratingData.averageRating.toFixed(1)} (
            {ratingData.totalRatings} rating
            {ratingData.totalRatings !== 1 ? "s" : ""})
          </>
        ) : (
          "No ratings yet"
        )}
      </div>
    </div>
  );
};
