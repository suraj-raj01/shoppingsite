import { Card } from "@/components/ui/card";

export default function ProductsGridSkeleton({ count = 3 }) {
  return (
    <section className="w-full mt-20 md:px-6 py-6">
      <div className="max-w-full mx-auto md:px-2 px-1">

        {/* Outer Grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-3
          gap-4
        ">
          
          {Array.from({ length: count }).map((_, index) => (
            <Card
              key={index}
              className="p-1 bg-background border-0 rounded-md shadow-none"
            >
              {/* Inner Grid (4 skeleton items) */}
              <div className="grid grid-cols-2 gap-5 md:gap-2">
                
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border rounded-md p-1">
                    
                    {/* Image Skeleton */}
                    <div className="aspect-4/3 rounded-md bg-gray-200 animate-pulse" />

                    {/* Text Skeleton */}
                    <div className="mt-2 space-y-1 px-1">
                      <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>

                  </div>
                ))}

              </div>
            </Card>
          ))}

        </div>
      </div>
    </section>
  );
}