import { useEffect, useMemo, useState } from "react";
import BASE_URL from "@/Config";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MapPin, Phone, Mail, HomeIcon, Trash2, Edit2Icon } from "lucide-react";
import { getAddress } from "../helpers/getAddress";
import { toast } from "sonner";

declare global {
    interface Window {
        Razorpay: any;
    }
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

    // ================= GET PRODUCT =================
    const getProductById = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/admin/products/${id}`
            );
            setProductData(res.data.data || null);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (id) getProductById();
    }, [id]);

    // ================= USER =================
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");

            if (!userData) {
                toast.error("Please login");
                navigate("/auth/login");
                return;
            }
            const parsed = JSON.parse(userData);
            setMyData(parsed.user);
        } catch {
            navigate("/auth/login");
        }
    }, []);

    // ================= LOCATION =================
    const getUserLocation = () => {
        setUseCurrentLocation(true);

        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        if (detecting) return;
        setDetecting(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                const loc = { latitude: lat, longitude: lng };
                setCoords(loc);
                localStorage.setItem("userLocation", JSON.stringify(loc));

                const addr = await getAddress(lat, lng);
                setAddress(addr);

                toast.success("Location detected");
                setDetecting(false);
            },
            () => {
                toast.error("Location failed");
                setDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // restore location
    useEffect(() => {
        const saved = localStorage.getItem("userLocation");
        if (saved) setCoords(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (!coords) return;

        (async () => {
            const addr = await getAddress(
                coords.latitude,
                coords.longitude
            );
            setAddress(addr);
        })();
    }, [coords]);

    // ================= ADDRESS STRING =================
    const fullAddress = useMemo(() => {
        if (!address) return mydata.address || "";

        return [
            address?.suburb,
            address?.postcode,
            address?.city,
            address?.state,
            address?.country,
        ]
            .filter(Boolean)
            .join(", ");
    }, [address, mydata.address]);

    // ================= PRODUCT DATA =================
    const loadRazorpay = () => {
        return new Promise<boolean>((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }
            const script = document.createElement("script")
            script.src = import.meta.env.VITE_RAZORPAY_API;
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
        if (!productData) return { totalAmount: 0, myProImg: "" };

        return {
            totalAmount: productData[0]?.price,
            myProImg: productData[0]?.defaultImage,
        };
    }, [productData]);

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
                "Shipping Address": useCurrentLocation ? address?.suburb ? address.county : address?.suburb + ", " + address?.postcode + ", " + address?.city + ", " + address?.state + ", " + address?.country : mydata.address,
            },
            order_id: data.id,

            handler: async (response: any) => {
                try {
                    const res = await axios.post(`${BASE_URL}/api/payment/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        productId: productData.map((item: any) => item.id),
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

            theme: { color: "#3674f0" },
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
                    shippingaddress: useCurrentLocation ? address?.suburb ? address.county : address?.suburb + ", " + address?.postcode + ", " + address?.city + ", " + address?.state + ", " + address?.country : mydata.address,
                    amount: totalAmount,
                    defaultImage: myProImg,
                    qnty: productData[0]?.qnty,
                    product: productData,
                }
            )

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

    const seeDetails = (id: string) => {
        navigate(`/products/view/${id}`);
    };

    // ================= LOADING =================
    if (!productData) {
        return <p className="p-5">Loading product...</p>;
    }

    // ================= UI =================
    return (
        <div className="grid md:grid-cols-2 gap-6 p-5">
            {/* LEFT - ADDRESS */}
            <Card className="bg-background shadow-xs rounded-sm">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>Shipping Address</CardTitle>

                    <Button onClick={getUserLocation} disabled={detecting}>
                        <MapPin size={16} />
                        {detecting ? "Detecting..." : "Use Current Location"}
                    </Button>
                </CardHeader>

                {address && (
                    <CardFooter>
                        <p className="text-sm">{fullAddress}</p>
                        <Trash2
                            className="ml-3 text-red-500 cursor-pointer"
                            onClick={() => {
                                localStorage.removeItem("userLocation");
                                setAddress(null);
                                setCoords(null);
                                setUseCurrentLocation(false);
                            }}
                        />
                    </CardFooter>
                )}

                <CardContent className="space-y-3">
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
                        <Link to={`/dashboard/profile/${mydata?._id}`} >
                            <Button className="bg-transparent border-1 shadow-none cursor-pointer hover:bg-[#3674f0] hover:text-white" variant="outline"><Edit2Icon className="h-4 w-4 " /></Button>
                        </Link>

                    </div>
                    <p className="flex items-center gap-2">
                        <Phone size={14} /> {mydata.contact}
                    </p>
                    <p className="flex items-center gap-2">
                        <Mail size={14} /> {mydata.email}
                    </p>
                    <p className="flex items-center gap-2">
                        <HomeIcon size={14} />
                        {useCurrentLocation
                            ? fullAddress
                            : mydata.address}
                    </p>
                </CardContent>
            </Card>

            {/* RIGHT - PRODUCT */}
            <div className="border p-4 rounded">
                <h3 className="text-xl font-bold mb-4">
                    Your Item
                </h3>

                <div className="flex flex-col md:flex-row justify-center align-center gap-4 border-b pb-4">
                    <div className="flex justify-center align-center">
                        <img
                            src={productData[0].defaultImage}
                            className="md:h-30 md:w-35 w-full object-contain cursor-pointer"
                            onClick={() => seeDetails(productData[0]._id)}
                        />
                    </div>

                    <div className="w-full">
                        <h4>{productData[0].name}</h4>
                        <p className="text-sm mt-3">
                            {productData[0].description}
                        </p>
                        <p className="font-bold">₹{productData[0].price}</p>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <h3>Total: ₹{totalAmount}</h3>

                    <Button
                        onClick={handlePay}
                        disabled={payLoading}
                    >
                        {payLoading ? "Processing..." : "Pay Now"}
                    </Button>
                </div>
            </div>
        </div>
    );
}