import { Skeleton } from "@/components/ui/skeleton"

export default function HeroSkeleton() {
  return (
    <section className="w-full">

      {/* Hero image skeleton */}
      <div className="relative w-full h-90 md:h-115 lg:h-120 mt-5 overflow-hidden">
        <Skeleton className="w-full h-full" />

        {/* Button skeleton overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </section>
  )
}