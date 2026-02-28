import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function PaymentSuccess() {
    const navigate = useNavigate()
    return (
        <div className="flex items-center md:max-w-full mx-auto mt-1 bg-green-500 justify-center h-166">
            <div className="text-center">
                <h1 className="text-4xl text-white font-bold mb-4">Payment Success</h1>
                <p className="text-lg text-gray-100">Thank you for your payment! Your order has been placed successfully.</p>
                <Button variant="outline" className="mt-4 px-4 py-2 rounded-xs" onClick={() => navigate("/")}>Continue Shopping</Button>
            </div>
        </div>
    )
}