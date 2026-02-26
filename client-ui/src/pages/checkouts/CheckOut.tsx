import { useEffect, useMemo, useState } from "react";
import BASE_URL from "@/Config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { itemInc, itemDec, itemDel } from "@/redux-toolkit/CartSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, HomeIcon } from "lucide-react"

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

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user")
            if (userData) {
                const parsedData = JSON.parse(userData)
                setMyData(parsedData.user)
            }
        } catch (err) {
            console.error("Invalid user in localStorage")
        }
    }, [])

    // ✅ computed values (IMPORTANT optimization)
    const { totalAmount, myProImg, } = useMemo(() => {
        let total = 0;
        let img = "";

        Data.forEach((item) => {
            total += Number(item.price * item.qnty);
            img = `${BASE_URL}/${item.defaultImage}`;
        });

        return {
            totalAmount: total,
            myProImg: img,
        };
    }, [Data]);

    const seeDetails = (id: string) => {
        navigate(`/products/view/${id}`);
    };

    // ✅ payment payload
    const data1 = {
        name: mydata.name,
        mobile: mydata.contact,
        email: mydata.email,
        defaultImg: mydata.profile,
        shippingaddress: mydata.address,
        product: Data || [],
    };

    // ✅ razorpay init
    const initPay = (data: any) => {
        const options = {
            key: "rzp_test_beWpubWRnZoYkT",
            amount: data.amount,
            currency: data.currency,
            name: data.name,
            description: "Test",
            image: myProImg,
            order_id: data.id,
            handler: async (response: any) => {
                try {
                    const verifyURL = `${BASE_URL}/api/payment/verify`;
                    await axios.post(verifyURL, response);
                } catch (error) {
                    console.log(error);
                }
            },
            theme: { color: "#3399cc" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    // ✅ handle pay
    const handlePay = async () => {
        try {
            const orderURL = `${BASE_URL}/api/payment/orders`;
            const { data } = await axios.post(orderURL, {
                amount: totalAmount,
                ...data1,
            });

            initPay(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div id="checkout" className="grid md:grid-cols-2 gap-6 p-4">

            {/* ✅ USER DETAILS */}
            <div className="w-full">
                <Card className="rounded-xs shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-1">
                        <CardTitle className="md:text-xl font-bold">
                            Shipping Address
                        </CardTitle>

                        <Button variant="outline" size="sm" className="gap-2">
                            <MapPin size={16} />
                            Use Current Location
                        </Button>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* user row */}
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden border">
                                {mydata.profile ? (
                                    <img
                                        src={mydata.profile}
                                        alt="profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted font-bold">
                                        {mydata?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="font-semibold">{mydata.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    Default Address
                                </p>
                            </div>

                            <div className="w-fit">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Link to={`/dashboard/profile/${mydata._id}`}>Update Address</Link>
                                </Button>
                            </div>
                        </div>

                        {/* details grid */}
                        <div className="flex flex-col gap-3 text-sm">
                            <p className="flex items-center gap-2">
                                <Phone size={16} className="text-muted-foreground" />
                                {mydata.contact}
                            </p>

                            <p className="flex items-center gap-2">
                                <Mail size={16} className="text-muted-foreground" />
                                {mydata.email}
                            </p>

                            <p className="flex items-start gap-2 sm:col-span-2">
                                <HomeIcon size={16} className="mt-0.5 text-muted-foreground" />
                                {mydata.address}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ✅ CART TABLE */}
            <div id="purchase-items" className="border rounded-xs p-4">
                <h3 className="text-xl font-bold mb-4">Your Purchase Items</h3>

                <div className="space-y-4">
                    {Data.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row gap-4 border rounded-xs p-4 shadow-sm"
                        >
                            {/* ✅ Image */}
                            <div className="flex justify-center sm:justify-start">
                                <img
                                    src={item.defaultImage}
                                    alt={item.name}
                                    className="h-24 w-full object-cover rounded-xs cursor-pointer"
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
                                        onClick={() => dispatch(itemDec({ id: item.id }))}
                                    >
                                        -
                                    </Button>
                                </div>

                                {/* delete */}
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="w-full cursor-pointer"
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

                    <Button onClick={handlePay} className="bg-green-600 hover:bg-green-700">
                        Pay Now
                    </Button>
                </div>
            </div>
        </div>
    );
}