import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

type CouponData = {
    code: string
    discount: number
}

export default function Coupon() {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)

    // 🔥 Fake API (replace with real API call)
    const validateCoupon = async (couponCode: string) => {
        return new Promise<CouponData>((resolve, reject) => {
            setTimeout(() => {
                if (couponCode.toLowerCase() === "save10") {
                    resolve({ code: "SAVE10", discount: 10 })
                } else if (couponCode.toLowerCase() === "flat50") {
                    resolve({ code: "FLAT50", discount: 50 })
                } else {
                    reject("Invalid coupon code")
                }
            }, 1000)
        })
    }

    const handleApply = async () => {
        if (!code.trim()) return

        setLoading(true)
        setError("")

        try {
            const res = await validateCoupon(code)
            setAppliedCoupon(res)
            setCode("")
        } catch (err: any) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = () => {
        setAppliedCoupon(null)
    }

    return (
        <div className="p-3">
            <section className="border md:max-w-xl mx-auto mt-20 shadow-sm border-gray-200 py-10 w-full rounded-xs p-6">

                <h2 className="text-lg font-semibold">Apply Coupon</h2>

                {/* INPUT */}
                {!appliedCoupon && (
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter coupon code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button onClick={handleApply} disabled={loading} className="bg-green-500 hover:bg-green-600">
                            {loading ? "Applying..." : "Apply Coupon"}
                        </Button>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {/* APPLIED COUPON */}
                {appliedCoupon && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xs">

                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 text-white">
                                {appliedCoupon.code}
                            </Badge>
                            <span className="text-sm text-green-700">
                                {appliedCoupon.discount}% discount applied 🎉
                            </span>
                        </div>

                        <Button
                            onClick={handleRemove}
                            className="text-gray-100 bg-red-500 hover:bg-red-600"
                        >
                            <X size={18} />
                        </Button>

                    </div>
                )}

            </section>
        </div>
    )
}