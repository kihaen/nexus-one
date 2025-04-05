import { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";

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
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/post/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, rating: selectedRating }),
      });

      if (response.ok) {
        setRating(selectedRating);
        await fetchRatings();
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
