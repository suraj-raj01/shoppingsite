import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function OrdersViewSkeleton() {
  return (
    <div className="p-3 w-full mx-auto space-y-3">

      <Card className="rounded-xs shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xs" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}

        </CardContent>
      </Card>

      {/* 🔷 ORDER ITEMS SKELETON */}
      <Card className="rounded-xs shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-xs p-4 bg-white space-y-3"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />

                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>

                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}

          </div>
        </CardContent>
      </Card>

    </div>
  )
}