export default function Orders() {
    return (
        <div className="flex flex-col gap-4 p-3">
            <h1 className="text-2xl font-bold">YOUR ORDERS</h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-sm text-gray-500">Order Status</p>
                </div>
            </div>
        </div>
    )
}