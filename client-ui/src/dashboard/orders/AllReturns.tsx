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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import { Trash, MoreHorizontal, CheckCircle2Icon, LucideEye } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import BASE_URL from '@/Config'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link, useNavigate } from 'react-router-dom'

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

export default function AllReturns() {
    const [returns, setReturns] = useState<Returns[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    const [open, setOpen] = useState(false)
    const [selectedReturn, setSelectedReturn] = useState<Returns | null>(null)

    const navigate = useNavigate()

    // ✅ Fetch
    const fetchReturns = async () => {
        try {
            setLoading(true)
            let res
            if (searchQuery) {
                res = await axios.get(`${BASE_URL}/api/returns/${searchQuery}`)
            } else {
                res = await axios.get(`${BASE_URL}/api/returns?page=${page}&limit=8`)
            }
            setReturns(res?.data?.data || [])
            setTotalPages(res?.data?.totalPages || 1)
            setCurrentPage(res?.data?.currentPage || 1)

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReturns()
    }, [searchQuery, page])

    // ✅ Update Status
    const handleUpdateStatus = async () => {
        if (!selectedReturn) return

        try {
            setUpdating(true);
            await axios.patch(
                `${BASE_URL}/api/returns/${selectedReturn._id}`,
                { status: selectedReturn.status }
            )

            toast.success("Status updated ✅")
            setOpen(false)
            fetchReturns()

        } catch (err) {
            console.error(err)
            toast.error("Failed ❌")
        } finally{
            setUpdating(false)
        }
    }

    // ✅ Delete
    const deleteReturns = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/api/returns/${id}`)
            toast.success("Deleted ✅")
            fetchReturns()
        } catch (err) {
            toast.error("Delete failed ❌")
        }
    }

    const columns: ColumnDef<Returns>[] = [
        { 
            accessorKey: 'userId', 
            header: "User ID" ,
            cell:({row})=>(
                <Link className='hover:text-blue-500 hover:underline' to={`/dashboard/customers/${row.original.userId}/view`}>{row.original.userId}</Link>
            )
        },

        { 
            accessorKey: 'productId', 
            header: "Product ID" ,
            cell:({row})=>(
                <Link className='hover:text-blue-500 hover:underline' to={`/dashboard/products/${row.original.productId}/view`}>{row.original.productId}</Link>
            )
        },
        { 
            accessorKey: 'orderId', 
            header: "Order ID" ,
            cell:({row})=>(
                <Link className='hover:text-blue-500 hover:underline' to={`/dashboard/orders/${row.original.orderId}/view`}>{row.original.orderId}</Link>
            )
        },
        { 
            accessorKey: 'reason', 
            header: "Reason" ,
            cell:({row})=>(
                <p>{row.original.reason}</p>
            )
        },
        { accessorKey: 'message', header: "Message" },

        {
            accessorKey: 'status',
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    className={`capitalize ${
                        row.original.status === "pending"
                            ? "bg-yellow-500"
                            : row.original.status === "approved"
                                ? "bg-blue-500"
                                : "bg-red-500"
                    }`}
                >
                    {row.original.status}
                </Badge>
            )
        },

        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/returns/${row.original._id}/view`)}>
                            <LucideEye className="mr-2 h-4 w-4" />
                            View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedReturn(row.original)
                                setOpen(true)
                            }}
                        >
                            <CheckCircle2Icon className="mr-2 h-4 w-4" />
                            Update Status
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => deleteReturns(row.original._id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    ]

    return (
        <section className="p-3">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">All Returns</h1>
                    <p className="text-muted-foreground">Manage return requests</p>
                </div>
            </div>

            {/* TABLE */}
            <DataTable
                columns={columns}
                data={returns}
                pageCount={totalPages}
                currentPage={currentPage}
                onPageChange={setPage}
                onSearch={setSearchQuery}
                isLoading={loading}
            />

            {/* ✅ SINGLE GLOBAL MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Return Status</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Select
                            value={selectedReturn?.status}
                            onValueChange={(val) =>
                                setSelectedReturn((prev) =>
                                    prev ? { ...prev, status: val } : prev
                                )
                            }
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button disabled={updating} onClick={handleUpdateStatus} className="w-full">
                            {updating?("Updating..."):("Update Status")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </section>
    )
}