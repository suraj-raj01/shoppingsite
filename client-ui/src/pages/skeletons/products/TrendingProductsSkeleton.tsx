import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TrendingProductsSkeleton() {
  return (
    <section className="w-full absolute md:px-6 md:block hidden rounded-md top-92 py-5">
      <div className="max-w-full mx-auto px-2 md:px-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden p-1 rounded-md">
              {/* Image */}
              <Skeleton className="w-full aspect-3/2" />

              {/* Content */}
              <CardContent className="p-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}