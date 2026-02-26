export default function Returns() {
    return (
        <div className="flex flex-col gap-4 p-3">
            <h1 className="text-2xl font-bold">YOUR RETURNS</h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Return ID</p>
                    <p className="text-sm text-gray-500">Return Date</p>
                    <p className="text-sm text-gray-500">Return Status</p>
                </div>
            </div>
        </div>
    )
}