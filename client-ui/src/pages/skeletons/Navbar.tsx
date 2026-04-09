import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background">
      {/* Top Row */}
      <div className="max-w-full mx-auto md:px-10 px-3 py-3 flex items-center gap-3">

        {/* Mobile menu */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Skeleton className="h-9 w-12 rounded-xs" />
        </Button>

        {/* Logo */}
        <Skeleton className="h-9 w-28" />

        {/* Mobile right icons */}
        <div className="ml-auto flex md:hidden items-center gap-1">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="absolute -top-1 -right-1 h-4 w-4 rounded-full" />
          </Button>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        {/* Location (desktop) */}
        <div className="hidden px-8 md:flex md:flex-col items-center gap-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Search (desktop) */}
        <div className="flex-1 hidden md:flex">
          <div className="flex w-full items-center gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-16" />
          </div>
        </div>

        {/* Right icons desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-3 pb-3">
        <div className="flex w-full gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-12" />
          <Skeleton className="h-10 w-12" />
        </div>
      </div>
    </nav>
  )
}