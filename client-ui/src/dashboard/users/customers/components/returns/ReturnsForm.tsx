import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import BASE_URL from "@/Config"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom"

type Role = {
    _id: string
    role: string
}

type User = {
    _id: string
    name: string
    email: string
    profile: string
    roleId?: Role[]
    contact: string
    address: string
}

export default function ReturnForm() {
    const { id } = useParams() // returnId (for update)
    const [orders, setOrders] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [orderloading, setOrderLoading] = useState(false)
    const [images, setImages] = useState<{ url: string }[]>([])

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user")
            if (userData) {
                const parsedData = JSON.parse(userData)
                setUser(parsedData.user)
            }
        } catch (err) {
            console.error("Invalid user in localStorage")
        }
    }, [])

    useEffect(() => {
        if (!user?._id) return;

        const fetchOrders = async () => {
            try {
                setOrderLoading(true);
                const res = await axios.get(`${BASE_URL}/api/payment/orders/${user._id}`);
                setOrders(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setOrderLoading(false)
            }
        };

        fetchOrders();
    }, [user]);

    const [form, setForm] = useState({
        orderId: "",
        productId: "",
        userId: user?._id,
        reason: "",
        message: "",
        images: [] as File[],
        status: "pending",
    })

    // ✅ FETCH FOR UPDATE
    useEffect(() => {
        if (!id) return

        const fetchReturn = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/returns/${id}`)
                const data = res?.data?.data[0] || {}
                console.log(data, 'data')

                setForm({
                    orderId: data.orderId,
                    productId: data.productId,
                    userId: user?._id || data.userId,
                    reason: data.reason,
                    message: data.message,
                    images: [],
                    status: data.status,
                })
                setImages(data.images.map((url: string) => ({ url })))
            } catch (err) {
                console.error(err)
            }
        }

        fetchReturn()
    }, [id])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const fd = new FormData()
        Array.from(files).forEach((file) => {
            fd.append("images", file)
        })

        setLoading(true)

        try {
            const res = await axios.post(
                `${BASE_URL}/api/admin/upload/multiple`,
                fd
            )

            const uploaded = res.data.files // [{ url: "..." }]

            setImages((prev) => [...prev, ...uploaded])

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    // INPUT CHANGE
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // handle product change
    const handleProductChange = (productId: string) => {
        setForm({
            ...form,
            productId
        });
    };

    // handle order change
    const handleOrderChange = (orderId: string) => {
        const selectedOrder = orders.find(o => o._id === orderId);
        setForm({
            ...form,
            orderId,
            productId: "" // reset product
        });
        // assuming order has products array
        setProducts(selectedOrder?.items || []);
    };

    const naviage = useNavigate();
    // SUBMIT
    const handleSubmit = async () => {
        try {
            setLoading(true)

            const payload = {
                ...form,
                userId: user?._id,
                images: images.map((img) => img.url),
            }

            if (id) {
                await axios.patch(`${BASE_URL}/api/returns/${id}`, payload)
                toast.success("Return updated ✅")
                naviage("/dashboard/allreturns")
            } else {
                await axios.post(`${BASE_URL}/api/returns`, payload)
                toast.success("Return created ✅")
                naviage("/dashboard/returns")
            }
        } catch (err: any) {
            console.error(err)
            toast.error("Something went wrong ❌")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-3">
            <section className="p-3 w-full md:max-w-2xl flex border flex-col items-center gap-2 justify-between">
                <h2 className="text-xl font-bold">
                    {id ? "Update Return Request" : "Create Return Request"}
                </h2>
                <div className="p-5 w-full md:max-w-xl bg-background grid grid-cols-1 md:grid-cols-2 gap-3 border-0 rounded-xs shadow-0 space-y-2">


                    {/* ORDER ID */}
                    <div>
                        <label>Order</label>
                        <Select onValueChange={handleOrderChange} disabled={orderloading} value={form.orderId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Order" />
                            </SelectTrigger>
                            <SelectContent>
                                {orders.map((order) => (
                                    <SelectItem key={order._id} value={order._id}>
                                        {order._id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* PRODUCT ID */}
                    <div>
                        <label>Product</label>
                        <Select onValueChange={handleProductChange} disabled={orderloading} value={form.productId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((p: any) => (
                                    <SelectItem key={p.productId} value={p.productId}>
                                        {p.name || p.productId}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* USER ID */}
                    <div>
                        <label>UserId</label>
                        <Input value={user?._id || ""} disabled />
                    </div>

                    {/* REASON */}
                    <div>
                        <label htmlFor="reason">Reason</label>
                        <Select
                            value={form.reason}
                            onValueChange={(val) => setForm({ ...form, reason: val })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select reason for return" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="damaged">Damaged Product</SelectItem>
                                <SelectItem value="wrong_item">Wrong Item Delivered</SelectItem>
                                <SelectItem value="not_as_described">Not as Described</SelectItem>
                                <SelectItem value="size_issue">Size/Fit Issue</SelectItem>
                                <SelectItem value="quality_issue">Quality Issue</SelectItem>
                                <SelectItem value="missing_parts">Missing Parts</SelectItem>
                                <SelectItem value="late_delivery">Late Delivery</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    {/* MESSAGE */}
                    <div className="col-span-2">
                        <label htmlFor="message">Message</label>
                        <Textarea
                            name="message"
                            placeholder="Additional message"
                            className="w-full"
                            value={form.message}
                            onChange={handleChange}
                        />
                    </div>

                    {/* STATUS (only for update/admin) */}
                    {id && (
                        <div className="col-span-2">
                            <label htmlFor="status">Status</label>
                            <Select
                                value={form.status}
                                onValueChange={(val) => setForm({ ...form, status: val })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* IMAGE UPLOAD */}
                    <div className="col-span-2">
                        <label htmlFor="images">Images</label>
                        <Input type="file" multiple onChange={handleImageUpload} className="col-span-2" />
                    </div>

                    {/* PREVIEW */}
                    <div className="flex gap-2 flex-wrap">
                        {images.map((img, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={img.url}
                                    className="w-20 h-20 object-cover rounded border"
                                />

                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* SUBMIT */}
                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading
                            ? "Submitting..."
                            : id
                                ? "Update Return"
                                : "Submit Return"}
                    </Button>

                </div>
            </section>
        </div>
    )
}