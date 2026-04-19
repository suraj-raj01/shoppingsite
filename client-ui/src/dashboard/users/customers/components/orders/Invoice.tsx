import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

type InvoiceType = {
    _id: string
    invoiceNumber: string
    createdAt: string

    userId: {
        _id: string
        name: string
        email: string
    }

    orderId: {
        _id: string
        paymentStatus: string
    }

    items: {
        _id: string
        productId: {
            _id: string
            name: string
            images: { url: string }[]
        }
        name: string
        quantity: number
        price: number
        total: number
    }[]

    totalAmount: number
    billingAddress: string
    status: string
}

export default function Invoice() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState<InvoiceType | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchInvoice = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${BASE_URL}/api/payment/invoice/${id}`)
            setInvoice(res?.data?.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchInvoice()
    }, [])

    // ✅ DOWNLOAD PDF
    const handleDownload = () => {
        if (!invoice) return

        const doc = new jsPDF()

        // HEADER
        doc.setFontSize(18)
        doc.text("INVOICE", 14, 20)

        doc.setFontSize(10)
        doc.text(`Invoice No: ${invoice.invoiceNumber}`, 14, 30)
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 14, 36)

        // CUSTOMER
        doc.text("Customer Details:", 14, 46)
        doc.text(`Name: ${invoice.userId.name}`, 14, 52)
        doc.text(`Email: ${invoice.userId.email}`, 14, 58)

        // ADDRESS
        doc.text("Billing Address:", 14, 68)
        doc.text(invoice.billingAddress, 14, 74)

        // ITEMS HEADER
        let y = 90
        doc.text("Items:", 14, y)
        y += 6

        invoice.items.forEach((item, i) => {
            doc.text(
                `${i + 1}. ${item.name} | Qty: ${item.quantity} | ₹${item.price} | Total: ₹${item.total}`,
                14,
                y
            )
            y += 6
        })

        // TOTAL
        doc.text(`Total Amount: ₹${invoice.totalAmount}`, 14, y + 10)
        doc.text(`Payment Status: ${invoice.status}`, 14, y + 16)

        doc.save(`invoice-${invoice.invoiceNumber}.pdf`)
    }

    return (
        <div className="p-3">
            {loading ? (
                <Skeleton className="w-full h-[400px]" />
            ) : invoice ? (
                <div className="space-y-6 bg-background p-5 border rounded-sm shadow-sm">

                    {/* HEADER */}
                    <div className="flex md:flex-row flex-col md:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-bold">Invoice</h1>
                            <p className="text-muted-foreground">
                                #{invoice.invoiceNumber}
                            </p>
                        </div>

                        <Button onClick={handleDownload} className="bg-[#6096ff] hover:bg-[#5089fa]">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>

                    {/* USER INFO */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Customer</h3>
                            <p>{invoice.userId.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {invoice.userId.email}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Billing Address</h3>
                            <p>{invoice.billingAddress}</p>
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div>
                        <h3 className="font-semibold mb-3">Items</h3>

                        <div className="space-y-3">
                            {invoice.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between border p-3 rounded-sm"
                                >
                                    <div className="flex items-center gap-3">

                                        <img
                                            src={item.productId?.images?.[0]?.url}
                                            className="w-14 h-14 object-cover rounded-md border"
                                        />

                                        <div>
                                            <p className="font-medium text-sm">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold">
                                            ₹{item.total}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            ₹{item.price} each
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="flex justify-between items-center border-t pt-4">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold">
                            ₹{invoice.totalAmount}
                        </span>
                    </div>

                    {/* STATUS */}
                    <div>
                        Payment Status :  {" "}
                        <Badge className="bg-green-600 capitalize">
                           {invoice.status}
                        </Badge>
                    </div>

                </div>
            ) : (
                <p>No invoice found</p>
            )}
        </div>
    )
}