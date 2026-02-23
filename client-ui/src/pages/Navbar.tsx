import axios from "axios"
import { useEffect, useState } from "react"
import { Search, ShoppingCart, Heart, MapPin, Menu } from "lucide-react"
import BASE_URL from "@/Config"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { DialogTitle } from "@/components/ui/dialog"
import { Link } from "react-router-dom"
import NavbarSkeleton from "./skeletons/Navbar"
import { toast } from "sonner"
import { getAddress } from "./helpers/getAddress"
import Translation from "./helpers/Translate"

type CategoryType = {
    _id: string
    categories: string
}

type NavbarType = {
    _id: string
    location: string
    signin: string
    logo: string
    url: string
}

export default function Navbar() {
    const [navbar, setNavbar] = useState<NavbarType | null>(null)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [category, setCategory] = useState<CategoryType[] | null>(null)
    const [loading, setLoading] = useState(true)

    const [address, setAddress] = useState<{
        suburb?: string
        postcode?: string
        city?: string
    } | null>(null)
    const [detecting, setDetecting] = useState(false)

    const [coords, setCoords] = useState<{
        latitude: number
        longitude: number
    } | null>(null)

    // ✅ get location
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported")
            return
        }

        setDetecting(true)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude

                const locationObj = { latitude: lat, longitude: lng }

                setCoords(locationObj)

                // ✅ persist
                localStorage.setItem("userLocation", JSON.stringify(locationObj))
                toast.success("Location detected")
                setDetecting(false)
            },
            () => {
                // toast.error("Permission denied or failed")
                setDetecting(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 1000,
                maximumAge: 0,
            }
        )
    }

    // ✅ restore location after refresh
    useEffect(() => {
        const saved = localStorage.getItem("userLocation")
        if (saved) {
            try {
                setCoords(JSON.parse(saved))
            } catch (err) {
                console.error("Failed to parse saved location:", err)
            }
        }
    }, [])

    // ✅ fetch address when coords change
    useEffect(() => {
        if (!coords) return

        const fetchAddress = async () => {
            try {
                const fullAddress = await getAddress(
                    coords.latitude,
                    coords.longitude
                )
                setAddress(fullAddress as { suburb?: string; postcode?: string; city?: string })
            } catch (err) {
                console.log("Address fetch failed:", err)
            }
        }

        fetchAddress()
    }, [coords])

    // ✅ fetch navbar + category together (fix loading bug)
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [navRes, catRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/admin/navbar`),
                    axios.get(`${BASE_URL}/api/admin/category`),
                ])

                setNavbar(navRes.data?.data?.[0] || null)
                setCategory(catRes.data || null)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [])

    if (loading) return <NavbarSkeleton />
    if (!navbar) return <div className="p-4">Navbar not found</div>

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="max-w-full mx-auto md:px-10 px-3 py-3 flex items-center gap-3">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="p-2">
                        <DialogTitle>
                            <img
                                src={navbar.logo}
                                alt="logo"
                                className="h-8 object-contain"
                            />
                        </DialogTitle>

                        <Button variant="ghost" className="w-full justify-start">
                            <Heart size={18} /> Wishlist
                        </Button>

                        <Button variant="ghost" className="w-full justify-start -mt-5">
                            <ShoppingCart size={18} /> Cart
                        </Button>

                        <Button variant="outline" className="w-full">
                            <Link to="/auth/login">{navbar.signin}</Link>
                        </Button>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <img src={navbar.logo} alt="logo" className="h-9 object-contain" />

                {/* Mobile Icons */}
                <div className="ml-auto flex md:hidden items-center gap-1">
                    <Button variant="ghost" size="icon">
                        <Heart />
                    </Button>

                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1 rounded-full">
                            0
                        </span>
                    </Button>
                </div>

                {/* ✅ Location */}
                <div className="hidden px-8 md:flex md:flex-col items-center text-sm text-muted-foreground">
                    <span>
                        {address
                            ? `${address.suburb ?? ""}, ${address.postcode ?? ""}, ${address.city ?? ""}`.trim()
                            : navbar.location}
                    </span>

                    <div
                        onClick={getUserLocation}
                        className="flex items-center cursor-pointer justify-center gap-2 font-bold"
                    >
                        <MapPin size={16} />
                        {detecting ? "Detecting..." : "Use Current Location"}
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 hidden md:flex">
                    <div className="flex w-full items-center justify-center">
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
                            className="w-full focus-visible:border-none focus-visible:ring-1 px-3 border-l rounded-none py-2 shadow-none outline-none"
                        />

                        <Button className="w-15 px-8">
                            <Search size={20} />
                        </Button>
                    </div>
                </div>

                {/* Right Icons */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Translation components */}
                    <Translation/>
                    <Button variant="ghost" size="icon">
                        <Heart />
                    </Button>

                    <Button variant="ghost" size="icon" className="relative -ml-2">
                        <ShoppingCart />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1 rounded-full">
                            0
                        </span>
                    </Button>

                    <Button variant="outline">
                        <Link to="/auth/login">{navbar.signin}</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}