export default function Footer1Skeleton() {
    return (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">

            {/* ABOUT SKELETON */}
            <div className="space-y-3">
                <div className="h-5 w-32 bg-gray-700 animate-pulse rounded" />
                <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-800 animate-pulse rounded" />
                    <div className="h-3 w-5/6 bg-gray-800 animate-pulse rounded" />
                    <div className="h-3 w-4/6 bg-gray-800 animate-pulse rounded" />
                </div>
            </div>

            {/* CONTACT SKELETON */}
            <div className="space-y-3">
                <div className="h-5 w-28 bg-gray-700 animate-pulse rounded" />
                <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-gray-800 animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-gray-800 animate-pulse rounded" />
                </div>
            </div>

            {/* SOCIAL SKELETON */}
            <div className="space-y-3">
                <div className="h-5 w-24 bg-gray-700 animate-pulse rounded" />
                <div className="flex gap-3">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}