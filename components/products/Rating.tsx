import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

export default function Rating({ rating, reviewCount, className = "" }: RatingProps) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div
      className={`flex items-center gap-1.5 text-xs text-fg-muted ${className}`}
      aria-label={`Rated ${rating.toFixed(1)} out of 5${
        reviewCount !== undefined ? ` from ${reviewCount.toLocaleString("en-US")} sample reviews` : ""
      }`}
    >
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`size-3.5 ${
              rounded >= star
                ? "fill-amber-400 text-amber-400"
                : rounded >= star - 0.5
                  ? "fill-amber-200 text-amber-400"
                  : "fill-line-strong text-fg-subtle"
            }`}
          />
        ))}
      </span>
      <span aria-hidden="true" className="font-semibold text-fg">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span aria-hidden="true">({reviewCount.toLocaleString("en-US")})</span>
      )}
    </div>
  );
}
