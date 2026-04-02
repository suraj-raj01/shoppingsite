import { Star } from "lucide-react";

type Props = {
  rating?: number;
  totalReviews?: number;
};

export default function ReviewRating({
  rating = 4.5,
  totalReviews = 123,
}: Props) {
  const totalStars = 5;

  // Example static breakdown (you can make dynamic later)
  const breakdown = [
    { star: 5, percent: 70 },
    { star: 4, percent: 15 },
    { star: 3, percent: 8 },
    { star: 2, percent: 4 },
    { star: 1, percent: 3 },
  ];

  return (
    <div className="w-full max-w-md space-y-4">

      {/* TOP RATING */}
      <div className="flex items-center gap-2">
        {/* STARS */}
        <div className="flex">
          {Array.from({ length: totalStars }).map((_, i) => {
            const isFilled = i < Math.floor(rating);
            const isHalf = i < rating && i >= Math.floor(rating);

            return (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  isFilled
                    ? "fill-yellow-500 text-yellow-500"
                    : isHalf
                    ? "fill-yellow-300 text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            );
          })}
        </div>

        {/* RATING TEXT */}
        <span className="font-semibold text-lg">{rating}</span>

        {/* TOTAL REVIEWS */}
        <span className="text-sm text-blue-600 cursor-pointer hover:underline">
          {totalReviews} ratings
        </span>
      </div>

      {/* BREAKDOWN */}
      <div className="space-y-2 py-5">
        {breakdown.map((item) => (
          <div key={item.star} className="flex items-center gap-2 text-sm">
            
            {/* STAR LABEL */}
            <span className="w-10 text-gray-600">
              {item.star} star
            </span>

            {/* PROGRESS BAR */}
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-500 rounded"
                style={{ width: `${item.percent}%` }}
              />
            </div>

            {/* PERCENT */}
            <span className="w-10 text-gray-600">
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}