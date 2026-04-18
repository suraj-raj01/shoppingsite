import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import api from "@/Config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, CalendarDays, IndianRupee, MapPin, CreditCard, ShieldCheck } from "lucide-react"
import OrdersViewSkeleton from "../skeleton/OrdersViewSkeleton"

export default function OrdersView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${api}/api/payment/orders/view/${id}`)
      setOrder(response.data.data)
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  if (loading) {
    return <OrdersViewSkeleton />
  }

  if (!order) {
    return <div className="p-6 text-center">Order not found</div>
  }

  return (
    <div className="p-3 max-w-full mx-auto space-y-3">
      {/* 🔷 ORDER SUMMARY */}
      <Card className="rounded-xs shadow-xs">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package size={20} />
            Order Details
          </CardTitle>

          <Badge className={`capitalize text-sm font-medium px-2 py-1 rounded-xs ${order.paymentStatus === "pending" ? "bg-red-500" : "bg-[#6096ff]"}`}>
            {order.paymentStatus}
          </Badge>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">

          {/* Order Date */}
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex items-center gap-3">
            <IndianRupee className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-semibold text-lg">
                ₹{order.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Shipping Address</p>
              <p className="font-medium break-words">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Razorpay Order ID */}
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Razorpay Order ID</p>
              <p className="font-medium break-all">{order.razorpay_order_id}</p>
            </div>
          </div>

          {/* Payment ID */}
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Payment ID</p>
              <p className="font-medium break-all">{order.razorpay_payment_id?(order.razorpay_payment_id):("NULL")}</p>
            </div>
          </div>

          {/* Signature */}
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">Payment Signature</p>
              <p className="font-medium break-all text-xs sm:text-sm">
                {order.razorpay_signature?(order.razorpay_signature):("NULL")}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 🔷 ORDER ITEMS */}
      <Card className="rounded-xs shadow-sm">
        <CardHeader>
          <CardTitle className="-mt-1 text-lg">Order Items</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 -mt-3 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.items?.map((item: any) => (
              <div
                key={item._id}
                className="border rounded-xs p-4 hover:shadow-md transition bg-background flex flex-col justify-between"
              >
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">Product ID</p>
                  <p className="text-muted-foreground break-all">
                    {item.productId}
                  </p>

                  <div className="flex justify-between mt-2">
                    <span>Qty: {item.quantity}</span>
                    <span className="font-semibold">
                      ₹{item.price?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full cursor-pointer"
                  onClick={() =>
                    navigate(`/products/view/${item.productId}`)
                  }
                >
                  View Product
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}