import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type BillingProps = {
    subtotal: number
    discount?: number
    delivery?: number
}

export default function Billings({
    subtotal = 0,
    discount = 0,
    delivery = 0,
}: BillingProps) {

    const total = subtotal - discount + delivery

    return (
        <div className="p-3">
            <section className="border md:max-w-xl rounded-xs p-5 bg-white shadow-sm space-y-4 w-full">

                <h2 className="text-lg font-semibold">Order Summary</h2>

                <div className="space-y-2 text-sm">

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-green-600">- ₹{discount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>
                            {delivery === 0 ? (
                                <span className="text-green-600">Free</span>
                            ) : (
                                `₹${delivery}`
                            )}
                        </span>
                    </div>

                </div>

                <Separator />

                {/* TOTAL */}
                <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>

                {/* CTA */}
                <Button className="w-full mt-2">
                    Place Order
                </Button>

            </section>
        </div>
    )
}