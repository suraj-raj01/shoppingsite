import { useEffect, useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '@/components/ui/data-table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Trash, MoreHorizontal, Eye, Edit } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import api from "@/Config"
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'


type Orders = {
    _id: string,
    name: string,
    email: string,
    contact: string,
    address: string,
    items: {
        productId: string,
        quantity: number,
        price: number
    }[],
    totalAmount: number,
    shippingAddress: string,
    paymentStatus: string,
}

export default function PaymentsTable() {
    const [orders, setOrders] = useState<Orders[]>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState<string>('')
    // console.log(user, "user data");
    // console.log(isAuthenticated, "isAuthenticated data");

    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user")

            if (userData) {
                const parsedData = JSON.parse(userData)
                setUserId(parsedData.user?._id)
            }
        } catch (err) {
            console.error("Invalid user in localStorage")
        }
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)

            let response

            if (searchQuery) {
                response = await axios.post(
                    `${api}/api/payment/orders/searchorder/${searchQuery}`
                )

                setOrders(response?.data?.data || [])
                setPageCount(response?.data?.totalPages || 1)

            } else {
                response = await axios.get(
                    `${api}/api/payment/orders/${userId}?page=${page}&limit=8`
                )
                setOrders(response?.data?.data || [])
                setPageCount(response?.data?.totalPages || 1)
                setPage(response.data.currentPage)
                // console.log(response.data, "response data");
            }

        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchOrders()
        }
    }, [userId, page, searchQuery])


    const delteOrders = async (id: any) => {
        try {
            await axios.delete(`${api}/api/payment/orders/${id}`)
            toast.success('Order deleted successfully')
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error)
            alert('Failed to delete Order. Please try again.')
        }
    }

    const navigate = useNavigate();
    const viewpage = (id: any) => {
        navigate(`/dashboard/orders/${id}/view`)
    }


    const columns: ColumnDef<Orders>[] = [

        {
            accessorKey: 'paymentStatus',
            header: "Payment Status",
            cell: ({ row }) => (
                <div>
                    <Badge
                        className={`capitalize text-xs font-medium px-2 py-1 rounded-xs ${row.original.paymentStatus === "pending" ? "bg-red-500" : "bg-[#6096ff]"}`}
                    >
                        {row.original.paymentStatus}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'totalAmount',
            header: "Total Amount",
            cell: ({ row }) => (
                <div>
                    <p>₹ {row.original.totalAmount}.00</p>
                </div>
            )
        },
        {
            accessorKey: 'razorpay_order_id',
            header: "Razorpay Order Id",
        },
        {
            accessorKey: 'razorpay_payment_id',
            header: "Razorpay Payment Id",
        },
        {
            header: "Action",
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-2">
                            <MoreHorizontal className="h-4 w-4" />
                            {/* <span className="hidden sm:inline">Actions</span> */}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewpage(row.original._id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Order
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={() => navigate(`/dashboard/orders/${row.original._id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={() => delteOrders(row.original._id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]


    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <section className="p-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <div>
                    {loading ? (
                        <>
                            <Skeleton className="h-9 w-32 mb-2" />
                            <Skeleton className="h-5 w-48" />
                        </>
                    ) : (
                        <>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Your All Payments</h1>
                                <p className="text-muted-foreground">
                                    You can track all the payment records
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button disabled>
                        Your All Payments
                    </Button>
                )}
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={orders}
                    pageCount={pageCount}
                    currentPage={page}
                    onPageChange={setPage}
                    onSearch={handleSearch}
                    isLoading={loading}
                />
            </div>
        </section>
    )
}