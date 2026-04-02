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
import { Trash, MoreHorizontal, Eye, Star, User2Icon, Package } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import api from "@/Config"
import { toast } from 'sonner'


type Reviews = {
    _id: string,
    userId: string,
    productId: string,
    ratings: number,
    review: string,
    createdAt: string,
    updatedAt: string,
}

export default function AllReviews() {
    const [reviews, setReviews] = useState<Reviews[]>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState<string>('')
    // console.log(user, "user data");
    // console.log(isAuthenticated, "isAuthenticated data");

    const fetchReview = async () => {
        try {
            setLoading(true)

            let response

            if (searchQuery) {
                response = await axios.post(
                    `${api}/api/reviews/searchreviews/${searchQuery}`
                )

                setReviews(response?.data?.data || [])
                setPageCount(response?.data?.totalPages || 1)

            } else {
                response = await axios.get(
                    `${api}/api/reviews?page=${page}&limit=5`
                )
                setReviews(response?.data?.data || [])
                setPageCount(response?.data?.totalPages || 1)
                setPage(response.data.currentPage)
            }

        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReview()
    }, [page, searchQuery])


    const deleteReviews = async (id: any) => {
        try {
            await axios.delete(`${api}/api/reviews/${id}`)
            toast.success('Order deleted successfully')
            fetchReview();
        } catch (error) {
            console.error('Error deleting order:', error)
            alert('Failed to delete Order. Please try again.')
        }
    }

    const navigate = useNavigate();
    const viewpage = (id: any) => {
        navigate(`/dashboard/reviews/${id}/view`)
    }


    const columns: ColumnDef<Reviews>[] = [
        {
            accessorKey: 'userId',
            header: "User ID",
        },
        {
            accessorKey: 'productId',
            header: "Product ID",
        },
        {
            accessorKey: 'ratings',
            header: "Ratings",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {Array.from({ length: row.original.ratings }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-green-500 text-green-500" />
                    ))}
                </div>
            ),
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
            header: "Action",
            accessorKey: "actions",
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
                            View Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/customers/${row.original.userId}/view`)}>
                            <User2Icon className="mr-2 h-4 w-4" />
                            View User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${row.original.productId}/view`)}>
                            <Package className="mr-2 h-4 w-4" />
                            View Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteReviews(row.original._id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Review
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
                                <h1 className="text-3xl font-bold tracking-tight">Your All Reviews</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all the reviews
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button disabled>
                        Your All Reviews
                    </Button>
                )}
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={reviews}
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