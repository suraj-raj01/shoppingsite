import { Skeleton } from "@/components/ui/skeleton"

export default function HeroSkeleton() {
  return (
    <section className="w-full">
      {/* Categories skeleton */}
      <div className="flex items-center gap-2 md:px-10 px-3 py-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-16" />
        ))}
      </div>

      {/* Hero image skeleton */}
      <div className="relative w-full h-130 md:h-135 lg:h-165 overflow-hidden">
        <Skeleton className="w-full h-full" />

        {/* Button skeleton overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </section>
  )
}