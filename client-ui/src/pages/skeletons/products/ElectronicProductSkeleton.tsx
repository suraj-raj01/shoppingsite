import { Card } from "@/components/ui/card"

export default function ElectronicProductsSkeleton() {
    return (
        <section className="w-full md:px-6 py-6 mt-350 md:mt-20 animate-pulse">
            <div className="max-w-full mx-auto px-2">
                {/* Heading Skeleton */}
                <div className="h-6 w-60 bg-gray-200 rounded mb-6" />

                {/* Cards Skeleton */}
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card
                            key={index}
                            className="basis-2/3 sm:basis-2/3 md:basis-3/4 lg:basis-3/4 border p-0"
                        >
                            <div className="w-full aspect-4/3 bg-gray-200 rounded" />
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}