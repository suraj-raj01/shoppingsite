import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

type Order = {
    _id: string,
    address: string,
    items: {
        productId: string,
        quantity: number,
        price: number
    }[],
    totalAmount: number,
    shippingAddress: string,
    paymentStatus: string,
    createdAt: string
}

export default function Invoice() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const [open, setOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null)
    const [productLoading, setProductLoading] = useState(false)

    const handleViewProduct = async (productId: string) => {
        try {
            setProductLoading(true)
            setOpen(true)

            const res = await axios.get(`${BASE_URL}/api/admin/products/${productId}`)
            setSelectedProduct(res.data?.data[0] || {})
        } catch (err) {
            console.error(err)
        } finally {
            setProductLoading(false)
        }
    }

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                `${BASE_URL}/api/payment/orders/view/${id}`
            )
            setOrder(res?.data?.data)
        } catch (error) {
            console.error("Error fetching order:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [])

    // ✅ DOWNLOAD PDF
    const handleDownload = () => {
        if (!order) return

        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Invoice", 14, 20)

        doc.setFontSize(10)
        doc.text(`Order ID: ${order._id}`, 14, 30)
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 36)

        doc.text("Billing Address:", 14, 46)
        doc.text(order.address || "-", 14, 52)

        doc.text("Shipping Address:", 14, 62)
        doc.text(order.shippingAddress || "-", 14, 68)

        doc.text("Items:", 14, 80)

        let y = 86
        order.items.forEach((item, index) => {
            doc.text(
                `${index + 1}. ProductId: ${item.productId} | Qty: ${item.quantity} | ₹${item.price}`,
                14,
                y
            )
            y += 6
        })

        doc.text(`Total: ₹${order.totalAmount}`, 14, y + 10)
        doc.text(`Payment: ${order.paymentStatus}`, 14, y + 16)

        doc.save(`invoice-${order._id}.pdf`)
    }

    return (
        <div className="p-3">
            {loading ? (
                <Skeleton className="w-full h-auto" />
            ) : order ? (
                <div className="space-y-6 bg-background p-5 border rounded-xs shadow-sm">

                    {/* HEADER */}
                    <div className="flex md:flex-row flex-col md:items-center items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Invoice</h1>
                            <p className="text-muted-foreground">
                                Order ID: {order._id}
                            </p>
                        </div>

                        <Button onClick={handleDownload} className="cursor-pointer w-full md:w-fit bg-[#6096ff] hover:bg-[#5089fa]">
                            <Download />  Download Invoice
                        </Button>
                    </div>

                    {/* ADDRESS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* <div>
                            <h3 className="font-semibold">Billing Address</h3>
                            <p>{order.address}</p>
                            <p>{order.shippingAddress}</p>
                        </div> */}
                        <div>
                            <h3 className="font-bold text-xl">Shipping Address</h3>
                            <p>{order.shippingAddress}</p>
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div>
                        <h3 className="font-bold text-xl mb-2">Order Items</h3>

                        <div className="rounded-xs grid grid-cols-1 md:grid-cols-2 gap-3">
                            {order.items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex flex-col bg-secondary border md:flex-row md:justify-between justify-start items-start p-3 text-sm"
                                >
                                    <div>
                                        <p className="font-medium">
                                            Product ID: {item.productId}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold">
                                            ₹{item.price * item.quantity}
                                        </p>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => handleViewProduct(item.productId)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-end gap-2 items-center border-t pt-4">
                        <span className="font-bold text-xl">Total Amount : </span>
                        <span className="text-xl font-bold">
                            ₹{order.totalAmount}
                        </span>
                    </div>

                    {/* PAYMENT STATUS */}
                    <div className="text-sm">
                        Payment Status:{" "}
                        <Badge className="font-medium text-xs bg-[#6096ff] capitalize">
                            {order.paymentStatus}
                        </Badge>
                    </div>

                </div>
            ) : (
                <p>No order found</p>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">

                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                    </DialogHeader>

                    {productLoading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : selectedProduct ? (
                        <div className="space-y-4">

                            {/* IMAGE */}
                            <img
                                src={selectedProduct.defaultImage}
                                alt=""
                                className="w-full h-52 object-contain border rounded-md"
                            />

                            {/* DETAILS */}
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {selectedProduct.name}
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    {selectedProduct.description}
                                </p>
                            </div>

                            <div className="flex justify-start gap-3 text-sm">
                                <span className="border px-1 py-1 rounded-xs">
                                    {selectedProduct.category}
                                </span>
                                <span className="border px-1 py-1 rounded-xs">
                                    {selectedProduct.brand}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold">
                                    Total Price : ₹{selectedProduct.price}
                                </span>

                                <Button
                                    className="cursor-pointer"
                                    onClick={() =>
                                        navigate(`/products/view/${selectedProduct._id}`)
                                    }
                                >
                                    Go to Product
                                </Button>
                            </div>

                        </div>
                    ) : (
                        <p>No product found</p>
                    )}

                </DialogContent>
            </Dialog>
        </div>
    )
}