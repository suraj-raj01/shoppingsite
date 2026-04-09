export default function ProductDetailsSkeleton() {
  return (
    <div className="mt-10 px-4 md:px-10 max-w-full mx-auto animate-pulse">
      <div className="grid lg:grid-cols-2 gap-12">

        {/* ================= LEFT SIDE ================= */}
        <div className="lg:sticky top-24 h-fit">

          {/* Main Image Skeleton */}
          <div className="border rounded-xs p-4 bg-background">
            <div className="w-full md:h-112.5 bg-gray-200 rounded-xs" />
          </div>

          {/* Thumbnail Skeletons */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-18 h-14 md:w-20 md:h-20 bg-gray-200 rounded-xs"
              />
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div>

          {/* Breadcrumb */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

          {/* Title */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-6" />

          {/* Price Section */}
          <div className="border-t pt-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>

          {/* Tags */}
          <div className="flex gap-3 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 bg-gray-200 rounded-xs"
              />
            ))}
          </div>

          {/* Variants */}
          <div className="mt-6">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-24 bg-gray-200 rounded-xs"
                />
              ))}
            </div>
          </div>

          {/* Short Description */}
          <div className="mt-8 border-t pt-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <div className="h-12 w-40 bg-gray-200 rounded-xs" />
            <div className="h-12 w-40 bg-gray-200 rounded-xs" />
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="mt-16 border-t pt-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-56" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-11/12" />
        <div className="h-4 bg-gray-200 rounded w-10/12" />
      </div>
    </div>
  );
}