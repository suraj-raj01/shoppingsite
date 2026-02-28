export default function PaymentFailed() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
                <p className="text-lg text-gray-600">Sorry, your payment could not be processed. Please try again.</p>
            </div>
        </div>
    )
}