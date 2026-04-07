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
import { Link, useNavigate } from 'react-router-dom'
import api from "@/Config"
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

type User = {
    _id: string
    name: string
    email: string
    profile: string
    contact: string
    address: string
}

type Returns = {
    _id: string,
    userId: string,
    productId: string,
    orderId: string,
    reason: string,
    message: string,
    images: string[],
    status: string,
    createdAt: string,
    updatedAt: string,
}

export default function Returns() {
    const [returns, setReturns] = useState<Returns[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const [user, setUser] = useState<User | null>(null)

    // ✅ Load user safely
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

    // ✅ Fetch returns
    const fetchReviews = async () => {
        // 🚫 prevent API call if user not ready
        if (!user && !searchQuery) return

        try {
            setLoading(true)

            let response

            if (searchQuery) {
                response = await axios.post(
                    `${api}/api/returns/searchreviews`,
                    {
                        query: searchQuery
                    }
                )
            } else {
                response = await axios.get(
                    `${api}/api/returns/${user?._id}`
                )
            }

            setReturns(response?.data?.data || [])
            // console.log(response.data,'data')

        } catch (error) {
            console.error("Error fetching returns:", error)
        } finally {
            setLoading(false)
        }
    }

    // ✅ Add user dependency
    useEffect(() => {
        fetchReviews()
    }, [searchQuery, user])


    const deleteReturns = async (id: any) => {
        try {
            await axios.delete(`${api}/api/reviews/${id}`)
            toast.success('Order deleted successfully')
            fetchReviews();
        } catch (error) {
            console.error('Error deleting order:', error)
            alert('Failed to delete Order. Please try again.')
        }
    }

    const navigate = useNavigate();
    const viewpage = (id: any) => {
        navigate(`/dashboard/returns/${id}/view`)
    }


    const columns: ColumnDef<Returns>[] = [
        {
            accessorKey: 'userId',
            header: "User ID",
        },
        {
            accessorKey: 'productId',
            header: "Product ID",
        },
        {
            accessorKey: 'orderId',
            header: "Order ID",
        },
        {
            accessorKey: 'reason',
            header: "Reason",
        },
        {
            accessorKey: 'message',
            header: "Message",
        },
        {
            accessorKey: 'updatedAt',
            header: "Updated At",
        },
        {
            accessorKey: 'status',
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    className={`capitalize ${row.original.status === "pending"
                            ? "bg-yellow-500"
                            : row.original.status === "approved"
                                ? "bg-green-500"
                                : "bg-red-600"
                        }`}
                >
                    {row.original.status}
                </Badge>
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
                            View Returns
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => navigate(`/auth/signup/${row.original._id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => deleteReturns(row.original._id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Returns
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
                                <h1 className="text-3xl font-bold tracking-tight">Your All Returns</h1>
                                <p className="text-muted-foreground">
                                    Manage and track your return items
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button>
                        <Link to="/dashboard/returns/add">Apply For Return</Link>
                    </Button>
                )}
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={returns}
                    pageCount={1}
                    currentPage={1}
                    onPageChange={() => { }}
                    onSearch={handleSearch}
                    isLoading={loading}
                />
            </div>
        </section>
    )
}