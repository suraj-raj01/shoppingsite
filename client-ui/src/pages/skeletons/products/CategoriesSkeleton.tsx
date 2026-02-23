import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesSkeleton() {
  return (
    <div className="flex items-center justify-start gap-2 md:px-10 px-3 py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-16" />
      ))}
    </div>
  )
}