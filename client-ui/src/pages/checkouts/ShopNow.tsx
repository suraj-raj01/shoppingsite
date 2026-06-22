import { useEffect, useMemo, useState } from "react";
import BASE_URL from "@/Config";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    MapPin, Phone, Mail, Home, Trash2,
    Package, CreditCard, ChevronRight, Tag, Zap,
} from "lucide-react";
import { getAddress } from "../helpers/getAddress";
import { toast } from "sonner";
import ScrollToTop from "../helpers/ScrollToTop";

declare global {
    interface Window { Razorpay: any }
}

type UserProfile = {
    name?: string;
    contact?: string;
    email?: string;
    address?: string;
    profile?: string;
    _id?: string;
};

export default function ShopNow() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [mydata, setMyData] = useState<UserProfile>({});
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [productData, setProductData] = useState<any>(null);
    const [address, setAddress] = useState<any>(null);
    const [coords, setCoords] = useState<any>(null);
    const [detecting, setDetecting] = useState(false);

    // ✅ Safe single-product alias — avoids repeating productData[0] everywhere
    const product = productData?.[0];

    // ── Fetch product ─────────────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        axios
            .get(`${BASE_URL}/api/admin/products/${id}`)
            .then((res) => setProductData(res.data.data || null))
            .catch(console.error);
    }, [id]);

    // ── Auth guard ────────────────────────────────────────────────
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            if (!userData) { toast.error("Please login"); navigate("/auth/login"); return; }
            setMyData(JSON.parse(userData).user);
        } catch { navigate("/auth/login"); }
    }, [navigate]);

    // ── Razorpay SDK (pre-load on mount) ──────────────────────────
    const loadRazorpay = () =>
        new Promise<boolean>((resolve) => {
            if (window.Razorpay) { resolve(true); return; }
            const script = document.createElement("script");
            script.src = import.meta.env.VITE_RAZORPAY_API;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    useEffect(() => { loadRazorpay(); }, []);

    // ── Location helpers ──────────────────────────────────────────
    const getUserLocation = () => {
        setUseCurrentLocation(true);
        if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
        if (detecting) return;
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                setCoords(loc);
                localStorage.setItem("userLocation", JSON.stringify(loc));
                setAddress(await getAddress(loc.latitude, loc.longitude));
                toast.success("Location detected");
                setDetecting(false);
            },
            () => { toast.error("Location failed"); setDetecting(false); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const clearLocation = () => {
        localStorage.removeItem("userLocation");
        setAddress(null);
        setCoords(null);
        setUseCurrentLocation(false);
    };

    // Restore saved location on mount
    useEffect(() => {
        const saved = localStorage.getItem("userLocation");
        if (saved) { try { setCoords(JSON.parse(saved)); } catch { } }
    }, []);

    // Re-resolve address when coords change
    useEffect(() => {
        if (!coords) return;
        getAddress(coords.latitude, coords.longitude).then(setAddress).catch(console.error);
    }, [coords]);

    // ── ✅ Fixed: single address builder (was suburb?county:suburb — backwards)
    const getShippingAddress = () => {
        if (useCurrentLocation && address) {
            return [address.suburb || address.county, address.postcode, address.city, address.state, address.country]
                .filter(Boolean).join(", ");
        }
        return mydata.address || "";
    };

    // ── Derived values ────────────────────────────────────────────
    const { totalAmount, myProImg } = useMemo(() => {
        if (!product) return { totalAmount: 0, myProImg: "" };
        return { totalAmount: product.price ?? 0, myProImg: product.defaultImage ?? "" };
    }, [product]);

    // ── Razorpay flow ─────────────────────────────────────────────
    const initPay = (data: any) => {
        const razorpay = new window.Razorpay({
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
                        productId: productData.map((item: any) => item.id),
                    });
                    if (res.data.success) { toast.success(res.data.message || "Payment successful 🎉"); navigate("/success"); }
                    else { toast.error(res.data.message || "Payment failed"); navigate("/failed"); }
                } catch { toast.error("Payment verification failed"); }
            },
            prefill: { name: mydata.name, email: mydata.email, contact: mydata.contact },
            theme: { color: "#3674f0" },
        });
        razorpay.open();
    };

    const handlePay = async () => {
        try {
            setPayLoading(true);
            if (!(await loadRazorpay())) { toast.error("Razorpay SDK failed to load"); return; }
            const { data } = await axios.post(`${BASE_URL}/api/payment/orders`, {
                id: mydata._id,
                shippingaddress: getShippingAddress(),
                amount: totalAmount,
                defaultImage: myProImg,
                qnty: product?.qnty,
                product: productData,
            });
            if (!data?.order?.id) { toast.error("Invalid order response"); return; }
            initPay(data.order);
        } catch { toast.error("Payment failed to start"); }
        finally { setPayLoading(false); }
    };

    // ── Loading state (was a bare <p>) ────────────────────────────
    if (!productData) {
        return (
            <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-9 h-9 border-[3px] border-[#6096ff] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Loading product…</p>
                </div>
            </div>
        );
    }

    // ── UI ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f5f7ff]">
            <ScrollToTop />

            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5">

                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span
                        className="text-[#6096ff] font-medium cursor-pointer hover:underline"
                        onClick={() => navigate(`/products/view/${product?._id}`)}
                    >
                        Product
                    </span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-800 font-semibold">Buy Now</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* ══ LEFT: Shipping ════════════════════════════════════ */}
                    <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">

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

                        {/* ✅ Detected address — filter(Boolean).join replaces broken ternary */}
                        {address && (
                            <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-sm px-3 py-2 mb-4">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span className="flex-1 text-xs text-emerald-700 leading-relaxed">
                                    {[address.suburb || address.county, address.postcode, address.city, address.state, address.country]
                                        .filter(Boolean).join(", ")}
                                </span>
                                <button
                                    title='btn'
                                    onClick={clearLocation}
                                    className="text-red-400 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {/* User row */}
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-sm border border-slate-100 mb-4">
                            <div className="w-11 h-11 rounded-full border-2 border-[#6096ff] overflow-hidden bg-slate-200 flex-shrink-0">
                                {mydata?.profile ? (
                                    <img src={mydata.profile} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center font-bold text-[#6096ff] text-sm">
                                        {mydata?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 text-sm truncate">{mydata?.name || "User"}</p>
                                <p className="text-xs text-slate-400">Delivering to this address</p>
                            </div>
                            <Button asChild variant="outline" size="sm" className="text-xs rounded-sm flex-shrink-0">
                                <Link to={`/dashboard/profile/${mydata?._id}`}>Edit</Link>
                            </Button>
                        </div>

                        {/* Contact + address */}
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
                                            ? getShippingAddress()
                                            : <span className="text-slate-400 italic">Detecting location…</span>
                                        : mydata.address || <span className="text-slate-400 italic">No address saved</span>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ══ RIGHT: Product + Pay ═══════════════════════════════ */}
                    <div className="space-y-4">

                        {/* Product card */}
                        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">
                            <h2 className="font-bold text-slate-800 text-base flex items-center gap-2 mb-4">
                                <Zap className="w-4 h-4 text-[#6096ff]" />
                                Your Item
                            </h2>

                            <div className="flex gap-4">
                                <div
                                    className="w-24 h-24 flex-shrink-0 bg-slate-50 rounded-md overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/products/view/${product._id}`)}
                                >
                                    <img
                                        src={product.defaultImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-1.5 hover:scale-105 transition-transform duration-200"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4
                                        className="font-semibold text-slate-800 text-sm line-clamp-2 cursor-pointer hover:text-[#6096ff] transition-colors"
                                        onClick={() => navigate(`/products/view/${product._id}`)}
                                    >
                                        {product.name}
                                    </h4>
                                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                        {product.description}
                                    </p>
                                    {/* ✅ toLocaleString() for Indian number formatting */}
                                    <p className="text-base font-bold text-slate-900 mt-2">
                                        ₹{product.price?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order summary + Pay */}
                        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5">
                            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-[#6096ff]" />
                                Order Summary
                            </h2>

                            <div className="space-y-2.5 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span>Price (1 item)</span>
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

                            {/* ✅ Pay button shows exact amount */}
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
                </div>
            </div>
        </div>
    );
}