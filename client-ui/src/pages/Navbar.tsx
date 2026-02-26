import axios from "axios"
import { useEffect, useState } from "react"
import { Search, ShoppingCart, Heart, MapPin, LucideMenu } from "lucide-react"
import BASE_URL from "@/Config"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    CreditCardIcon,
    LogOutIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react"

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
import { Link, useNavigate } from "react-router-dom"
import NavbarSkeleton from "./skeletons/Navbar"
import { toast } from "sonner"
import { getAddress } from "./helpers/getAddress"
import Translation from "./helpers/Translate"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux-toolkit/Store"

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
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const cartItems = useSelector((state: RootState) => state.addtoCart.cart);
    const likeItems = useSelector((state: RootState) => state.addtoLike.likes);

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
                // console.log(navRes.data.data[0])
                // console.log(catRes.data)
                setCategory(catRes.data || null)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [])

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user")
            if (userData) {
                setUser(JSON.parse(userData))
            }
        } catch (err) {
            console.error("Invalid user in localStorage")
        }
    }, [])

    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        toast.success("Logged out successfully")
        navigate("/")
    }

    if (loading) return <NavbarSkeleton />
    // if (!navbar) return <div className="p-4">Navbar not found</div>

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background backdrop-blur-2xl">
            <div className="max-w-full mx-auto md:px-10 px-3 py-3 flex items-center gap-3">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden -ml-3">
                            <LucideMenu />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="p-2">
                        <DialogTitle>
                            <img
                                src={navbar?.logo}
                                alt="logo"
                                className="h-8 object-contain"
                            />
                        </DialogTitle>

                        <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('products/likeditems') }}>
                            <Heart size={18} /> Wishlist
                        </Button>

                        <Button variant="ghost" className="w-full justify-start -mt-5" onClick={() => { navigate('products/cartitems') }}>
                            <ShoppingCart size={18} /> Cart <span className="text-red-600">{cartItems.length}</span>
                        </Button>

                        {
                            user?.user?.contact ? (
                                <Button variant="outline">
                                    <Link to="/dashboard">
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <Link to="/auth/login">
                                    <Button variant='outline' className="w-full justify-center">
                                        {navbar?.signin}
                                    </Button>
                                </Link>
                            )
                        }
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <img src={navbar?.logo} alt="logo" onClick={() => { navigate('/') }} className="h-9 -ml-2 object-contain" />

                {/* Mobile Icons */}
                <div className="ml-auto flex md:hidden items-center gap-1">
                    {
                        likeItems.length > 0 ? (
                            <Button variant="ghost" size="icon" onClick={() => { navigate('products/likeditems') }}>
                                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                            </Button>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={() => { navigate('products/likeditems') }}>
                                <Heart className="h-6 w-6" />
                            </Button>
                        )
                    }

                    <Button variant="ghost" size="icon" className="relative -ml-3" onClick={() => { navigate('products/cartitems') }}>
                        <ShoppingCart />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1 rounded-full">
                            {cartItems.length}
                        </span>
                    </Button>
                    <Link to="/auth/login">
                        {user?.user?.contact ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="rounded-full text-green-600 text-md p-1">
                                        <div className="rounded-full flex p-0 items-center justify-center border cursor-pointer text-xl h-7 w-full">
                                            {user?.user?.profile ? (
                                                <img src={user?.user?.profile || ""} alt="Profile" className="w-full h-full rounded-full" />
                                            ) : (
                                                user?.user?.name[0]?.toUpperCase() || "U"
                                            )}
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Link to="/dashboard" className="flex items-center gap-2">
                                            <UserIcon />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCardIcon />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <SettingsIcon />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive" onClick={logout} className="cursor-pointer">
                                        <LogOutIcon />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant='outline' className="ml-1">{navbar?.signin}</Button>
                        )}
                    </Link>
                </div>

                {/* ✅ Location */}
                <div className="hidden px-8 md:flex md:flex-col items-center text-sm text-muted-foreground">
                    <span>
                        {address
                            ? `${address.suburb ?? ""}, ${address.postcode ?? ""}, ${address.city ?? ""}`.trim()
                            : navbar?.location}
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

                        <Button variant='outline' className="w-18 border-l-0 px-8">
                            <Search className=" font-bold" />
                        </Button>
                    </div>
                </div>

                {/* Right Icons */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Translation components */}
                    <Translation />
                    <Button variant="ghost" size="icon" className="relative ml-3" onClick={() => { navigate('products/likeditems') }}>
                        {
                            likeItems.length > 0 ? (
                                <Button variant="ghost" size="icon" onClick={() => { navigate('products/likeditems') }}>
                                    <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                                </Button>
                            ) : (
                                <Button variant="ghost" size="icon" onClick={() => { navigate('products/likeditems') }}>
                                    <Heart className="h-6 w-6" />
                                </Button>
                            )
                        }
                    </Button>

                    <Button variant="ghost" size="icon" className="relative -ml-3" onClick={() => { navigate('products/cartitems') }}>
                        <ShoppingCart />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1 rounded-full">
                            {cartItems.length}
                        </span>
                    </Button>

                    <Link to="/auth/login">
                        {user?.user?.contact ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="rounded-full flex p-0 items-center justify-center border cursor-pointer text-xl h-8 w-8">
                                        {user?.user?.profile ? (
                                            <img src={user?.user?.profile || ""} alt="Profile" className="w-full h-full rounded-full" />
                                        ) : (
                                            user?.user?.name[0]?.toUpperCase() || "U"
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Link to="/dashboard" className="flex items-center gap-2">
                                            <UserIcon />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCardIcon />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <SettingsIcon />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive" onClick={logout} className="cursor-pointer">
                                        <LogOutIcon />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant='outline'>{navbar?.signin}</Button>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}