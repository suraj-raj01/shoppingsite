export default function Reviews() {
    return (
        <div className="flex flex-col gap-4 p-3">
            <h1 className="text-2xl font-bold">YOUR REVIEWS</h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Review ID</p>
                    <p className="text-sm text-gray-500">Review Date</p>
                    <p className="text-sm text-gray-500">Review Status</p>
                </div>
            </div>
        </div>
    )
}