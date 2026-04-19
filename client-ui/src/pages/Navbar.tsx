import axios from "axios"
import { useEffect, useState } from "react"
import { ShoppingCart, Heart, LucideMenu, LayoutDashboardIcon, SearchIcon, CreditCardIcon, LogOutIcon, SettingsIcon, X, } from "lucide-react"
import BASE_URL from "@/Config"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link, useNavigate } from "react-router-dom"
import NavbarSkeleton from "./skeletons/Navbar"
import { toast } from "sonner"
import Translation from "./helpers/Translate"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux-toolkit/Store"
import SearchProducts from "./helpers/SearchProducts"
import SearchProductsMobileView from "./helpers/SearchProductsMobileView"
import CategoriesSkeleton from "./skeletons/products/CategoriesSkeleton"

type NavbarType = {
    _id: string
    location: string
    signin: string
    logo: string
    url: string
}

type Subcategories = {
    _id: string
    name: string
    brands: string[]
}

type Category = {
    _id: string
    categories: string
    subcategories: Subcategories[]
}

export default function Navbar() {
    const [navbar, setNavbar] = useState<NavbarType | null>(null)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [openSheet, setOpenSheet] = useState(false)

    const cartItems = useSelector((state: RootState) => state.addtoCart.cart);
    const likeItems = useSelector((state: RootState) => state.addtoLike.likes);

    // ✅ fetch navbar + category together (fix loading bug)
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [navRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/admin/navbar`),
                ])
                setNavbar(navRes.data?.data?.[0] || null)
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
    const [categories, setCategories] = useState<Category[]>([])

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/category`)
            setCategories(res.data?.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    if (loading) return <NavbarSkeleton />
    if (loading) return <CategoriesSkeleton />
    // if (!navbar) return <div className="p-4">Navbar not found</div>

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-white backdrop-blur-2xl">
            <div className="max-w-full w-full flex justify-between items-center mx-auto md:px-10 px-3 py-3 gap-3">
                {/* Mobile Menu */}
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden -ml-3">
                            <LucideMenu className="text-[#06286b]" />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="p-2 bg-white">
                        <DialogTitle className="">
                            <img
                                src={navbar?.logo}
                                alt="logo"
                                className="h-10 w-auto object-contain"
                            />
                        </DialogTitle>
                        <h2 className="text-md -mb-5 text-[#6096ff] font-medium">Cart Items</h2>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('products/likeditems'); setOpenSheet(false) }}>
                            <Heart size={18} /> Wishlist
                        </Button>
                        <Button variant="ghost" className="w-full justify-start -mt-7" onClick={() => { navigate('products/cartitems'); setOpenSheet(false) }}>
                            <ShoppingCart size={18} /> Cart <span className="text-red-600">{cartItems.length}</span>
                        </Button>

                        {/* categories */}
                        <div>
                            <h2 className="text-md -mt-3 font-medium text-[#6096ff]">Categories</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {categories?.map((category) => (
                                    <AccordionItem key={category._id} value={category._id}>

                                        {/* Category (Trigger) */}
                                        <AccordionTrigger className="text-sm font-bold mb-1 hover:no-underline px-3">
                                            <p onClick={() => navigate(`/products/${category.categories}`)}>{category.categories}</p>
                                        </AccordionTrigger>

                                        {/* Subcategories */}
                                        <AccordionContent className="pl-6 -mt-1">
                                            <div className="flex flex-col gap-1">
                                                {category.subcategories.map((sub) => (
                                                    <p
                                                        key={sub._id}
                                                        className="text-left text-sm hover:text-green-600"
                                                        onClick={() => navigate(`/products/${sub.name}`)}
                                                    >
                                                        ➡️ {sub.name}
                                                    </p>
                                                ))}
                                            </div>
                                        </AccordionContent>

                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>

                        {
                            user?.user?.contact ? (
                                <Button variant="default">
                                    <Link to="/dashboard">
                                        Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <Link to="/auth/login">
                                    <Button variant='default' className="w-full justify-center">
                                        {navbar?.signin}
                                    </Button>
                                </Link>
                            )
                        }
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <img src={navbar?.logo} alt="logo" onClick={() => { navigate('/') }} className="h-10 w-auto -ml-4 object-contain" />

                {/* Mobile Icons */}
                <div className="ml-auto flex md:hidden items-center gap-1">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <SearchIcon
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => setOpen(true)}
                            />
                        </DialogTrigger>
                        <DialogContent showCloseButton={false} className="w-full">
                            <DialogHeader>
                                <DialogTitle>Search Products</DialogTitle>
                                <div className="mt-5">
                                    <SearchProductsMobileView onClose={() => setOpen(false)} />
                                </div>
                            </DialogHeader>
                            <DialogFooter className="mt-5">
                                <DialogClose asChild className="absolute top-2 right-2">
                                    <Button variant="destructive"><X /></Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                                    <div className="rounded-full -mr-4 text-green-600 text-md p-1">
                                        <div className="rounded-full flex p-0 items-center justify-center border cursor-pointer text-xl h-7 w-full">
                                            {user?.user?.profile ? (
                                                <img src={user?.user?.profile || ""} alt="Profile" className="w-full object-cover h-full rounded-full" />
                                            ) : (
                                                user?.user?.name[0]?.toUpperCase() || "U"
                                            )}
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Link to="/dashboard" className="flex items-center gap-2">
                                            <LayoutDashboardIcon />
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
                            <Button variant='default' className="ml-1 -mr-2">{navbar?.signin}</Button>
                        )}
                    </Link>
                </div>
                <SearchProducts />

                {/* Right Icons */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Translation components */}
                    <Translation />
                    <div className="relative ml-0" onClick={() => { navigate('products/likeditems') }}>
                        {
                            likeItems.length > 0 ? (
                                <Button variant="ghost" className="cursor-pointer rounded-full" size="icon" onClick={() => { navigate('products/likeditems') }}>
                                    <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                                </Button>
                            ) : (
                                <Button variant="ghost" className="cursor-pointer rounded-full" size="icon" onClick={() => { navigate('products/likeditems') }}>
                                    <Heart className="h-6 w-6" />
                                </Button>
                            )
                        }
                    </div>

                    <Button variant="ghost" size="icon" className="relative cursor-pointer rounded-full -ml-3" onClick={() => { navigate('products/cartitems') }}>
                        <ShoppingCart />
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1 rounded-full">
                            {cartItems.length}
                        </span>
                    </Button>

                    <Link to="/auth/login">
                        {user?.user?.contact ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="rounded-full flex p-0 items-center justify-center -mr-5 border cursor-pointer text-xl h-8 w-8">
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
                                            <LayoutDashboardIcon />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCardIcon />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/dashboard/settings" className="flex items-center gap-2">
                                            <SettingsIcon />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive" onClick={logout} className="cursor-pointer">
                                        <LogOutIcon />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant='default'>{navbar?.signin}</Button>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}