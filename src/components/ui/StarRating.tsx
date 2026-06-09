import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
  linkTo?: string;
}

const sizeMap = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

export function StarRating({ rating, size = "md", showValue, count, linkTo }: StarRatingProps) {
  const iconSize = sizeMap[size];
  const value = Math.round(rating * 10) / 10;

  const stars = [1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      className={`${iconSize} ${
        star <= Math.round(rating)
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-500 fill-gray-500"
      }`}
    />
  ));

  if (showValue) {
    return (
      <div className="flex items-center gap-2">
        <span className={`${size === "lg" ? "text-5xl" : "text-3xl"} font-bold text-[var(--text)]`}>
          {value.toFixed(1)}
        </span>
        <div>
          <div className="flex gap-0.5 mb-1">{stars}</div>
          {count !== undefined && (
            <span className="text-sm text-[var(--text-muted)]">
              Based on {count} review{count !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    );
  }

  const starsEl = (
    <div className="flex gap-0.5">
      {stars}
    </div>
  );

  if (linkTo) {
    return (
      <a href={linkTo} className="inline-flex items-center gap-2 hover:underline">
        {starsEl}
        {count !== undefined && (
          <span className="text-sm text-[var(--text-muted)]">{count} Reviews</span>
        )}
      </a>
    );
  }

  return starsEl;
}
