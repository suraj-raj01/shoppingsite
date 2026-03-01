import { useEffect, useMemo, useState } from "react";
import BASE_URL from "@/Config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { itemInc, itemDec, itemDel } from "@/redux-toolkit/CartSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, HomeIcon, Trash2 } from "lucide-react"
import { getAddress } from "../helpers/getAddress";
import { toast } from "sonner";

declare global {
    interface Window {
        Razorpay: any;
    }
}

type CartItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    qnty: number;
    defaultImage: string;
};

type RootState = {
    addtoCart: {
        cart: CartItem[];
    };
};

type UserProfile = {
    name?: string;
    contact?: string;
    email?: string;
    address?: string;
    profile?: string;
    _id?: string;
};

export default function CheckOut() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Data = useSelector((state: RootState) => state.addtoCart.cart);

    const [mydata, setMyData] = useState<UserProfile>({});
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [payLoading, setPayLoading] = useState(false)

    const [address, setAddress] = useState<{
        suburb?: string
        postcode?: string
        city?: string
        state?: string
        country?: string
    } | null>(null)
    const [detecting, setDetecting] = useState(false)

    const [coords, setCoords] = useState<{
        latitude: number
        longitude: number
    } | null>(null)

    // ✅ get location
    const getUserLocation = () => {
        setUseCurrentLocation(true)
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported")
            return
        }

        if (detecting) return // ✅ prevent spam clicks

        setDetecting(true)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude

                    const locationObj = { latitude: lat, longitude: lng }

                    setCoords(locationObj)

                    // ✅ save immediately
                    localStorage.setItem("userLocation", JSON.stringify(locationObj))

                    // 🔥 fetch address immediately (NO WAIT for useEffect)
                    const fullAddress = await getAddress(lat, lng)

                    setAddress(
                        fullAddress as {
                            suburb?: string
                            postcode?: string
                            city?: string
                        }
                    )

                    toast.success("Location detected")
                } catch (err) {
                    console.error("Address fetch failed:", err)
                    toast.error("Failed to fetch address")
                } finally {
                    setDetecting(false)
                }
            },
            (error) => {
                console.error(error)

                if (error.code === 1) {
                    toast.error("Location permission denied")
                } else if (error.code === 2) {
                    toast.error("Location unavailable")
                } else if (error.code === 3) {
                    toast.error("Location request timed out")
                }

                setDetecting(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // ✅ VERY IMPORTANT (was too small)
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

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user")

            if (!userData) {
                toast.error("Please login to continue")
                navigate("/auth/login", { replace: true })
                return
            }

            const parsedData = JSON.parse(userData)

            if (!parsedData?.user) {
                toast.error("Session expired. Please login again")
                navigate("/auth/login", { replace: true })
                return
            }

            setMyData(parsedData.user)
        } catch (err) {
            console.error("Invalid user data", err)
            navigate("/auth/login", { replace: true })
        }
    }, [navigate])

    const seeDetails = (id: string) => {
        navigate(`/products/view/${id}`);
    };

    const loadRazorpay = () => {
        return new Promise<boolean>((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }
            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    useEffect(() => {
        loadRazorpay()
    }, [])
    // ✅ computed values (IMPORTANT optimization)
    const { totalAmount, myProImg, } = useMemo(() => {
        let total = 0;
        let img = "";

        Data.forEach((item) => {
            total += Number(item.price * item.qnty);
            img = `${item.defaultImage}`;
        });

        return {
            totalAmount: total,
            myProImg: img,
        };
    }, [Data]);

    // ✅ razorpay init
    const initPay = (data: any) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Shopping Site",
            description: "Order Payment",
            image: myProImg,
            notes: {
                "Shipping Address": useCurrentLocation ? address?.suburb + ", " + address?.postcode + ", " + address?.city + ", " + address?.state + ", " + address?.country : mydata.address,
            },
            order_id: data.id,

            handler: async (response: any) => {
                try {
                    const res = await axios.post(`${BASE_URL}/api/payment/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    })
                    if (res.data.success) {
                        toast.success(res.data.message || "Payment successful 🎉")
                        navigate("/success")
                    }
                    else {
                        toast.error(res.data.message || "Payment failed")
                        navigate("/failed")
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Payment verification failed")
                }
            },

            prefill: {
                name: mydata.name,
                email: mydata.email,
                contact: mydata.contact,
            },

            theme: { color: "#0d7d03ff" },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
    }

    // ✅ handle pay
    const handlePay = async () => {
        try {
            setPayLoading(true)

            const res = await loadRazorpay()
            if (!res) {
                toast.error("Razorpay SDK failed to load")
                return
            }

            const { data } = await axios.post(
                `${BASE_URL}/api/payment/orders`,
                {
                    id: mydata._id,
                    shippingaddress: mydata.address,
                    amount: totalAmount,
                    defaultImage: myProImg,
                    product: Data,
                }
            )
            console.log(data)

            if (!data?.order?.id) {
                toast.error("Invalid order response")
                return
            }

            initPay(data.order)

        } catch (error) {
            console.log(error)
            toast.error("Payment failed to start")
        } finally {
            setPayLoading(false)
        }
    }
    return (
        <div id="checkout" className="grid grid-cols-1 md:grid-cols-2 gap-6 p-3">

            {/* ✅ USER DETAILS */}
            <div className="w-full">
                <Card className="rounded-xs shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="md:text-xl font-bold">
                            Shipping Address
                        </CardTitle>

                        <Button variant="outline" size="sm" className="gap-2 bg-green-500 text-white hover:bg-green-600 hover:text-white cursor-pointer" onClick={getUserLocation}>
                            <MapPin size={16} />
                            {detecting ? "Detecting..." : "Current Location"}
                        </Button>
                    </CardHeader>

                    {address && (
                        <CardFooter className="flex flex-row items-center -mt-3 justify-start">
                            <p className="text-sm text-muted-foreground">
                                {address.suburb}, {address.postcode}, {address.city}, {address.state}, {address.country}
                            </p>
                            <Button variant="outline" size="sm" className="border-0 ml-3 shadow-none gap-2 cursor-pointer" onClick={() => {
                                localStorage.removeItem("userLocation")
                                setAddress(null)
                                setCoords(null)
                                setUseCurrentLocation(false)
                            }}>
                                <Trash2 size={16} className="text-red-500" />
                            </Button>
                        </CardFooter>
                    )}

                    <CardContent className="space-y-3">
                        {/* user row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-xs bg-white">

                            {/* LEFT SECTION */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">

                                {/* Avatar */}
                                <div className="h-15 w-15 min-w-[48px]  border border-green-500 rounded-full overflow-hidden border bg-muted">
                                    {mydata?.profile ? (
                                        <img
                                            src={mydata.profile}
                                            alt="profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-bold">
                                            {mydata?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">
                                        {mydata?.name || "User"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Default Address
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT SECTION */}
                            <div className="w-full sm:w-auto">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                >
                                    <Link to={`/dashboard/profile/${mydata?._id}`}>
                                        Update Details
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* details grid */}
                        <div className="flex flex-col gap-3 text-md">
                            <p className="flex items-center gap-2">
                                <Phone size={16} className="text-green-500" />
                                Phone : {mydata.contact}
                            </p>

                            <p className="flex items-center gap-2">
                                <Mail size={16} className="text-green-500" />
                                Email : {mydata.email}
                            </p>

                            <div className="flex items-center gap-2 sm:col-span-2">
                                <HomeIcon size={16} className="h-8 w-8 md:h-4 md:w-4 text-green-500" />
                                {useCurrentLocation ? (
                                    <p>Current Location : {detecting ? "Detecting..." : address?.suburb + ", " + address?.postcode + ", " + address?.city + ", " + address?.state + ", " + address?.country}</p>
                                ) : (
                                    <p>Default Address : {mydata.address ? (mydata.address) : (address?.suburb + ", " + address?.postcode + ", " + address?.city)}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ✅ CART TABLE */}
            {
                Data.length > 0 && (
                    <div id="purchase-items" className="border w-full rounded-xs p-2">
                        <h3 className="text-xl font-bold mb-4">Your Purchase Items</h3>

                        <div className="space-y-4">
                            {Data.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex  overflow-x-auto md:overflow-visible flex-row gap-4 rounded-xs p-2 border-b min-w-[320px] md:min-w-0"
                                >
                                    {/* ✅ Image */}
                                    <div className="flex justify-center md:justify-start">
                                        <img
                                            src={item.defaultImage}
                                            alt={item.name}
                                            className="md:h-24 md:w-30 h-16 w-20 object-cover rounded-xs cursor-pointer flex-shrink-0"
                                            onClick={() => seeDetails(item.id)}
                                        />
                                    </div>

                                    {/* ✅ Content */}
                                    <div className="flex-1 space-y-2">
                                        <h4 className="font-semibold text-base line-clamp-1">
                                            {item.name}
                                        </h4>

                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.description}
                                        </p>

                                        <div className="font-bold text-lg">
                                            ₹{item.price * item.qnty}
                                        </div>
                                    </div>

                                    {/* ✅ Actions */}
                                    <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3">
                                        {/* qty */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => dispatch(itemInc({ id: item.id }))}
                                            >
                                                +
                                            </Button>

                                            <b>{item.qnty}</b>

                                            <Button
                                                size="icon"
                                                variant="outline"
                                                disabled={item.qnty === 1}
                                                onClick={() => dispatch(itemDec({ id: item.id }))}
                                            >
                                                -
                                            </Button>
                                        </div>

                                        {/* delete */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="md:w-full cursor-pointer text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                            onClick={() => dispatch(itemDel({ id: item.id }))}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ✅ TOTAL */}
                        <div className="flex justify-between items-center mt-6">
                            <h3 className="text-xl font-bold">Total: ₹{totalAmount}</h3>

                            <Button disabled={payLoading} onClick={handlePay}>
                                {payLoading ? "Processing..." : "Pay Now"}
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}