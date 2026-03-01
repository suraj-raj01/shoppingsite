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
import { Trash, MoreHorizontal, Eye } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import api from "@/Config"
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/loginContext'


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


export default function OrdersTable() {
    const [orders, setOrders] = useState<Orders[]>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const { isAuthenticated } = useAuth()
    // console.log(user, "user data");
    // console.log(isAuthenticated, "isAuthenticated data");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login')
        }
    }, [isAuthenticated])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            let response
            if (searchQuery) {
                response = await axios.post(`${api}/api/payment/orders/searchorder/${searchQuery}`)
                setOrders(response?.data?.data || [])
                // console.log(response.data, "search data");
            } else {
                response = await axios.get(`${api}/api/payment/orders?page=${page}&limit=5`)
                setOrders(response?.data?.data || [])
                setPage(response.data.currentPage)
                setPageCount(response.data.totalPages)
                // console.log("userdata data", response.data)
            }
            const { data } = response
            setPageCount(data.totalPages || 1)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [page, searchQuery])


    const deleteUser = async (id: any) => {
        try {
            await axios.delete(`${api}/api/payment/orders/${id}`)
            toast.success('Order deleted successfully')
            fetchCategories();
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
                        className={`capitalize text-xs font-medium px-2 py-1 rounded-xs ${row.original.paymentStatus === "pending" ? "bg-red-500" : "bg-green-500"}`}
                    >
                        {row.original.paymentStatus}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: 'shippingAddress',
            header: "Shipping Address",
        },
        
        {
            accessorKey: 'items',
            header: "Items",
            cell: ({ row }) => (
                <div>
                    {row.original.items.map((item) => (
                        <div key={item.productId} className='flex gap-2 mb-1'>
                            <Badge variant="outline">Quantity: {item.quantity}</Badge>
                            <Badge variant="outline">Price: ₹{item.price}</Badge>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: 'totalAmount',
            header: "Total Amount",
            cell: ({ row }) => (
                <div>
                    <p>₹{row.original.items.map((item) => (item.price * item.quantity)).reduce((a, b) => a + b, 0)}</p>
                </div>
            ),
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
                        {/* <DropdownMenuItem onClick={() => navigate(`/auth/signup/${row.original._id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => deleteUser(row.original._id)}>
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
                                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all the orders
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button disabled>
                        All Orders
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