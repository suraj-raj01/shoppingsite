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
import { Trash, Edit, MoreHorizontal, Eye } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Link, useNavigate } from 'react-router-dom'
import api from "@/Config"
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'


type Footer = {
    _id: string,
    icons:{
        title:string,
        url:string
    }[]
    copyright:string
}


export default function FooterTable() {
    const [footer, setFooter] = useState<Footer[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const fetchCategories = async () => {
        try {
            setLoading(true)
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/api/admin/footer/${searchQuery}`)
                setFooter(response?.data || [])
                console.log(response.data, "search data");
            } else {
                response = await axios.get(`${api}/api/admin/footer`)
                setFooter(response?.data?.data || [])
                setPage(response.data.currentPage)
                // console.log("footer data", response.data)
            }
        } catch (error) {
            console.error('Error fetching footer:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [page, searchQuery])


    const deleteCategory = async (id: any) => {
        try {
            await axios.delete(`${api}/api/admin/footer/${id}`)
            toast.success('Footer deleted successfully')
            fetchCategories();
        } catch (error) {
            console.error('Error deleting permission:', error)
            alert('Failed to delete Role. Please try again.')
        }
    }

    const navigate = useNavigate();
    const viewpage = (id: any) => {
        navigate(`/dashboard/footer/${id}/view`)
    }


    const columns: ColumnDef<Footer>[] = [
        {
            accessorKey: 'aboutTitle',
            header: "About",
        },
        {
            accessorKey: 'contactTitle',
            header: "Contact",
        },
        {
            accessorKey: 'followus',
            header: "Follow Us",
        },
        {
            accessorKey: 'copyright',
            header: "Copyright",
            cell: ({ row }) => {
                return (
                    <div className='text-wrap'>
                        <p>{row.original.copyright}</p>
                    </div>
                )
            }
        },
        {
            accessorKey: 'icons',
            header: "Icons",
            cell: ({ row }) => {
                const icons = row.original?.icons || [];
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {icons.length === 0 ? (
                            <span className="text-muted-foreground">No icons</span>
                        ) : (
                            icons.map((icon: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-xs">
                                    <Badge className="font-medium bg-green-500">{icon.title}</Badge>
                                    <Link to={icon.url} className="text-blue-500 text-sm">{icon.url}</Link>
                                </div>
                            ))
                        )}
                    </div>
                );
            }
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
                            View Footer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/footer/${row.original._id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Footer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCategory(row.original._id)}>
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
                                <h1 className="text-3xl font-bold tracking-tight">Footer</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all the footer
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button disabled={footer.length>=1} onClick={() => { navigate("/dashboard/footer") }}>
                        Create Footer
                    </Button>
                )}
            </div>

            <div className="w-full overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={footer}
                    pageCount={1}
                    currentPage={1}
                    onPageChange={()=>{}}
                    onSearch={handleSearch}
                    isLoading={loading}
                />
            </div>
        </section>
    )
}