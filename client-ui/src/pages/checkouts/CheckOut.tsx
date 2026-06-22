import { useEffect, useMemo, useState } from "react";
import BASE_URL from "@/Config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { itemInc, itemDec, itemDel } from "@/redux-toolkit/CartSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    MapPin, Phone, Mail, Home, Trash2,
    Plus, Minus, ShoppingBag, Package,
    CreditCard, ChevronRight, Tag,
} from "lucide-react";
import { getAddress } from "../helpers/getAddress";
import { toast } from "sonner";
import ScrollToTop from "../helpers/ScrollToTop";

declare global {
    interface Window { Razorpay: any }
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
    addtoCart: { cart: CartItem[] };
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
    const [payLoading, setPayLoading] = useState(false);
    const [address, setAddress] = useState<any>(null);
    const [detecting, setDetecting] = useState(false);
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    // ── Location detection (logic unchanged) ───────────────────────────
    const getUserLocation = () => {
        setUseCurrentLocation(true);
        if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
        if (detecting) return;
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const locationObj = { latitude: lat, longitude: lng };
                    setCoords(locationObj);
                    localStorage.setItem("userLocation", JSON.stringify(locationObj));
                    const fullAddress = await getAddress(lat, lng);
                    setAddress(fullAddress as any);
                    toast.success("Location detected");
                } catch { toast.error("Failed to fetch address"); }
                finally { setDetecting(false); }
            },
            (error) => {
                if (error.code === 1) toast.error("Location permission denied");
                else if (error.code === 2) toast.error("Location unavailable");
                else if (error.code === 3) toast.error("Location request timed out");
                setDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const clearLocation = () => {
        localStorage.removeItem("userLocation");
        setAddress(null);
        setCoords(null);
        setUseCurrentLocation(false);
    };

    useEffect(() => {
        const saved = localStorage.getItem("userLocation");
        if (saved) { try { setCoords(JSON.parse(saved)); } catch { } }
    }, []);

    useEffect(() => {
        if (!coords) return;
        const fetchAddress = async () => {
            try {
                const fullAddress = await getAddress(coords.latitude, coords.longitude);
                setAddress(fullAddress as any);
            } catch (err) { console.log("Address fetch failed:", err); }
        };
        fetchAddress();
    }, [coords]);

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (!userData) { toast.error("Please login to continue"); navigate("/auth/login", { replace: true }); return; }
            const parsedData = JSON.parse(userData);
            if (!parsedData?.user) { toast.error("Session expired. Please login again"); navigate("/auth/login", { replace: true }); return; }
            setMyData(parsedData.user);
        } catch { navigate("/auth/login", { replace: true }); }
    }, [navigate]);

    // ✅ Fixed: unified address builder (was duplicated + had suburb?county:suburb bug)
    const getShippingAddress = () => {
        if (useCurrentLocation && address) {
            return [
                address.suburb || address.county,
                address.postcode,
                address.city,
                address.state,
                address.country,
            ].filter(Boolean).join(", ");
        }
        return mydata.address || "";
    };

    const loadRazorpay = () =>
        new Promise<boolean>((resolve) => {
            if (window.Razorpay) { resolve(true); return; }
            const script = document.createElement("script");
            script.src = import.meta.env.VITE_RAZORPAY_API;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const { totalAmount, myProImg } = useMemo(() => {
        let total = 0, img = "";
        Data.forEach((item) => { total += item.price * item.qnty; img = item.defaultImage; });
        return { totalAmount: total, myProImg: img };
    }, [Data]);

    const initPay = (data: any) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Shopping Site",
            description: "Order Payment",
            image: myProImg,
            notes: { "Shipping Address": getShippingAddress() },
            order_id: data.id,
            handler: async (response: any) => {
                try {
                    const res = await axios.post(`${BASE_URL}/api/payment/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        productId: Data.map((item) => item.id),
                    });
                    if (res.data.success) { toast.success(res.data.message || "Payment successful 🎉"); navigate("/success"); }
                    else { toast.error(res.data.message || "Payment failed"); navigate("/failed"); }
                } catch { toast.error("Payment verification failed"); }
            },
            prefill: { name: mydata.name, email: mydata.email, contact: mydata.contact },
            theme: { color: "#3674f0" },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const handlePay = async () => {
        try {
            setPayLoading(true);
            const res = await loadRazorpay();
            if (!res) { toast.error("Razorpay SDK failed to load"); return; }
            const { data } = await axios.post(`${BASE_URL}/api/payment/orders`, {
                id: mydata._id,
                shippingaddress: getShippingAddress(),
                amount: totalAmount,
                defaultImage: myProImg,
                product: Data,
            });
            if (!data?.order?.id) { toast.error("Invalid order response"); return; }
            initPay(data.order);
        } catch { toast.error("Payment failed to start"); }
        finally { setPayLoading(false); }
    };

    const totalItems = Data.reduce((acc, item) => acc + item.qnty, 0);

    return (
        <div className="min-h-screen bg-[#f5f7ff]">
            <ScrollToTop />

            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5">

                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span
                        className="text-[#6096ff] font-medium cursor-pointer hover:underline"
                        onClick={() => navigate("/products/cartitems")}
                    >
                        Cart
                    </span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-800 font-semibold">Checkout</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* ══ LEFT: Shipping Address ══════════════════════════════ */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">

                            {/* Card header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#6096ff]" />
                                    Shipping Address
                                </h2>
                                <Button
                                    size="sm"
                                    onClick={getUserLocation}
                                    className="bg-[#6096ff] hover:bg-[#5089fa] text-white text-xs rounded-sm h-8 gap-1.5 cursor-pointer"
                                >
                                    <MapPin className="w-3 h-3" />
                                    {detecting ? "Detecting…" : "Use My Location"}
                                </Button>
                            </div>

                            {/* ✅ Detected address tag (fixed: was suburb?county:suburb which was backwards) */}
                            {address && (
                                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-sm px-3 py-2 mb-4">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="flex-1 text-xs text-emerald-700 leading-relaxed">
                                        {[
                                            address.suburb || address.county,
                                            address.postcode,
                                            address.city,
                                            address.state,
                                            address.country,
                                        ].filter(Boolean).join(", ")}
                                    </span>
                                    <button
                                        title="Remove Location"
                                        onClick={clearLocation}
                                        className="text-red-400 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* User profile row */}
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100 mb-4">
                                <div className="w-11 h-11 rounded-full border-2 border-[#6096ff] overflow-hidden bg-slate-200 flex-shrink-0">
                                    {mydata?.profile ? (
                                        <img
                                            src={mydata.profile}
                                            alt="profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-bold text-[#6096ff] text-sm">
                                            {mydata?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm truncate">
                                        {mydata?.name || "User"}
                                    </p>
                                    <p className="text-xs text-slate-400">Delivering to this address</p>
                                </div>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="text-xs rounded-sm flex-shrink-0"
                                >
                                    <Link to={`/dashboard/profile/${mydata?._id}`}>Edit</Link>
                                </Button>
                            </div>

                            {/* Contact + address details */}
                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2.5">
                                    <Phone className="w-4 h-4 text-[#6096ff] flex-shrink-0" />
                                    <span>{mydata.contact || <span className="text-slate-400 italic">Not set</span>}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Mail className="w-4 h-4 text-[#6096ff] flex-shrink-0" />
                                    <span className="truncate">{mydata.email || <span className="text-slate-400 italic">Not set</span>}</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <Home className="w-4 h-4 text-[#6096ff] flex-shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">
                                        {useCurrentLocation
                                            ? address
                                                ? [address.suburb || address.county, address.postcode, address.city, address.state, address.country].filter(Boolean).join(", ")
                                                : <span className="text-slate-400 italic">Detecting location…</span>
                                            : mydata.address || <span className="text-slate-400 italic">No address saved</span>
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT: Order Items + Summary ════════════════════════ */}
                    {Data.length > 0 && (
                        <div className="space-y-4">

                            {/* Items list */}
                            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">
                                <h2 className="font-bold text-slate-800 text-base flex items-center gap-2 mb-4">
                                    <ShoppingBag className="w-4 h-4 text-[#6096ff]" />
                                    Order Items
                                    <span className="text-xs font-normal text-slate-400">
                                        ({totalItems} {totalItems === 1 ? "item" : "items"})
                                    </span>
                                </h2>

                                <div className="space-y-3">
                                    {Data.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0"
                                        >
                                            {/* Image */}
                                            <div
                                                className="w-16 h-16 flex-shrink-0 bg-slate-50 rounded-md overflow-hidden cursor-pointer"
                                                onClick={() => navigate(`/products/view/${item.id}`)}
                                            >
                                                <img
                                                    src={item.defaultImage}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-1 hover:scale-105 transition-transform duration-200"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4
                                                    className="text-sm font-semibold text-slate-800 line-clamp-1 cursor-pointer hover:text-[#6096ff] transition-colors"
                                                    onClick={() => navigate(`/products/view/${item.id}`)}
                                                >
                                                    {item.name}
                                                </h4>
                                                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                                    {item.description}
                                                </p>
                                                {/* ✅ toLocaleString() for proper Indian number formatting */}
                                                <p className="text-sm font-bold text-slate-900 mt-1">
                                                    ₹{(item.price * item.qnty).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* Qty stepper + Remove */}
                                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                                <div className="flex items-center border border-slate-200 rounded-sm overflow-hidden">
                                                    <button
                                                        title='btn'
                                                        disabled={item.qnty === 1}
                                                        onClick={() => dispatch(itemDec({ id: item.id }))}
                                                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3 text-slate-600" />
                                                    </button>
                                                    <span className="px-3 py-1 text-xs font-semibold text-slate-800 border-x border-slate-200 bg-white min-w-[1.75rem] text-center">
                                                        {item.qnty}
                                                    </span>
                                                    <button
                                                        title='btn'
                                                        onClick={() => dispatch(itemInc({ id: item.id }))}
                                                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3 text-slate-600" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => dispatch(itemDel({ id: item.id }))}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order summary + Pay button */}
                            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">
                                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#6096ff]" />
                                    Order Summary
                                </h2>

                                <div className="space-y-2.5 text-sm text-slate-600">
                                    <div className="flex justify-between">
                                        <span>Price ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                                        <span>₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Delivery</span>
                                        <span className="font-medium">FREE</span>
                                    </div>
                                </div>

                                <Separator className="my-3" />

                                <div className="flex justify-between text-base font-bold text-slate-900 mb-4">
                                    <span>Total Amount</span>
                                    <span>₹{totalAmount.toLocaleString()}</span>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-sm px-3 py-2 flex items-center gap-2 mb-4">
                                    <Tag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <p className="text-xs text-slate-500">
                                        100% secure payment via Razorpay
                                    </p>
                                </div>

                                {/* ✅ Pay button shows amount inline so user knows exactly what they're paying */}
                                <Button
                                    onClick={handlePay}
                                    disabled={payLoading}
                                    className="w-full bg-[#6096ff] hover:bg-[#5089fa] text-white py-5 text-sm font-semibold rounded-sm flex items-center gap-2 cursor-pointer disabled:opacity-70"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    {payLoading ? "Processing…" : `Pay ₹${totalAmount.toLocaleString()}`}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}