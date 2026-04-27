import { Card } from "@/components/ui/card"

export default function ElectronicProductsSkeleton() {
    return (
        <section className="w-full md:px-6 py-6 mt-8 md:mt-1 animate-pulse">

            {/* 🔹 Mobile View */}
            <div className="grid grid-cols-2 gap-3 md:hidden">

                {/* Heading */}
                <div className="col-span-2 h-6 w-40 bg-gray-200 rounded mb-2" />

                {Array.from({ length: 6 }).map((_, index) => (
                    <Card
                        key={index}
                        className="overflow-hidden rounded-sm border p-3 bg-white"
                    >
                        {/* Image */}
                        <div className="w-full h-28 bg-gray-200 rounded mb-2" />

                        {/* Title */}
                        <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />

                        {/* Brand */}
                        <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />

                        {/* Price */}
                        <div className="flex gap-2">
                            <div className="h-4 w-12 bg-gray-200 rounded" />
                            <div className="h-4 w-10 bg-gray-200 rounded" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* 🔹 Desktop View */}
            <div className="max-w-full mx-auto md:block hidden px-2">

                {/* Heading */}
                <div className="h-6 w-52 bg-gray-200 rounded mb-3" />

                {/* Cards */}
                <div className="flex gap-2 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card
                            key={index}
                            className="basis-2/3 sm:basis-2/3 md:basis-3/4 lg:basis-3/4 border p-3 bg-white"
                        >
                            {/* Image */}
                            <div className="w-full h-40 bg-gray-200 rounded mb-3" />

                            {/* Title */}
                            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />

                            {/* Brand */}
                            <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />

                            {/* Category */}
                            <div className="h-3 w-full bg-gray-200 rounded mb-3" />

                            {/* Price */}
                            <div className="flex gap-3">
                                <div className="h-4 w-16 bg-gray-200 rounded" />
                                <div className="h-4 w-12 bg-gray-200 rounded" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}