import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import axios from "axios"
import BASE_URL from "@/Config"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProductFilters from "./Filtering"
type CategoryType = {
    _id: string
    categories: string
}

export default function SearchProducts() {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [category, setCategory] = useState<CategoryType[] | null>(null)
    const [search, setSearch] = useState("")
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (!search.trim()) {
                setSuggestions([])
                return
            }
            try {
                setLoading(true)
                const res = await axios.get(`${BASE_URL}/api/admin/products/search/${search}`)
                setSuggestions(res?.data?.data || [])
                setShowDropdown(true)
                ProductFilters(res?.data?.data || [])
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }, 800) // 🔥 debounce

        return () => clearTimeout(delayDebounce)
    }, [search])

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/admin/category`)
                setCategory(res.data)
                // console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchCategory()
    }, [])

    const navigate = useNavigate()

    return (
        <div>
            <div className="flex-1 hidden md:flex md:w-2xl">
                <div className="flex w-full items-center justify-center shadow-xs">
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-fit shadow-none border-r-0">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {category?.map((item) => (
                                <SelectItem key={item._id} value={item.categories}>
                                    {item.categories}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full focus-visible:border-none focus-visible:ring-1 px-3 border-l rounded-none py-2 shadow-none outline-none"
                    />

                    <Button variant='outline' className="w-18 border rounded-xs px-8">
                        <Search className="font-bold" name="search" onChange={(e: any) => { setSearch(e.target.value) }} />
                    </Button>
                </div>
            </div>
            {showDropdown && search && (
                <div className="absolute top-full left-center w-full mx-auto md:w-2xl bg-background border rounded-xs shadow-lg z-50 max-h-80">

                    {loading && (
                        <p className="p-3 text-sm text-muted-foreground">Searching...</p>
                    )}

                    {!loading && suggestions.length === 0 && (
                        <p className="p-3 text-sm text-muted-foreground">
                            No results found
                        </p>
                    )}

                    {!loading &&
                        suggestions.length > 0 && suggestions.map((item: any) => (
                            <div
                                key={item._id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                            >
                                <div className="flex flex-col" onClick={() => { navigate(`/products/view/${item._id}`); setShowDropdown(false) }}>
                                    <div className="flex items-center gap-2">
                                        <img src={item.defaultImage} alt="" className="w-10 h-10" />
                                        <div className="text-sm flex flex-col font-medium ">
                                            <span className="line-clamp-1">
                                                {item.name}
                                            </span>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span className="line-clamp-1 border px-2 py-0.5 rounded-xs">
                                                    {item.category}
                                                </span>
                                                <span className="line-clamp-1 border px-2 py-0.5 rounded-xs">
                                                    {item.brand}
                                                </span>
                                                <span className="line-clamp-1 border px-2 py-0.5 rounded-xs">
                                                    ₹{item.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}