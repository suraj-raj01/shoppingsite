import type { RootState } from "@/redux-toolkit/Store";
import { useDispatch, useSelector } from "react-redux";
import {
    itemInc as incrementQty,
    itemDec as decrementQty,
    itemDel as removeFromCart
} from "@/redux-toolkit/CartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartItems() {
    const dispatch = useDispatch();
    const cartItems = useSelector(
        (state: RootState) => state.addtoCart.cart
    );

    // ✅ total price
    const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.salePrice * (item.qnty ?? 0),
        0
    );

    if (cartItems.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500 text-xl">
                🛒 Your cart is empty
            </div>
        );
    }

    const navigate = useNavigate();

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">Your Cart Items</h1>

            {/* ✅ cart list */}
            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div
                        key={item._id}
                        className="flex overflow-scroll md:overflow-hidden md:flex-row gap-4 border rounded-xs p-3 md:p-1 md:px-5 shadow-sm"
                    >
                        {/* image */}
                        <img
                            src={item.defaultImage}
                            alt={item.name}
                            onClick={() => navigate(`/products/view/${item._id}`)}
                            loading="lazy"
                            className="w-38 h-30 object-cover mx-auto rounded-xs"
                        />

                        <Separator orientation="vertical" className="h-40 mx-2" />
                        {/* details */}
                        <div className="flex-1">
                            <h2 className="font-semibold line-clamp-2">
                                {item.name}
                            </h2>

                            <p className="text-gray-500 text-sm">
                                Brand: {item.brand}
                            </p>

                            <div className="font-bold text-lg mt-1">
                                ₹{item.salePrice.toLocaleString()}
                                <span className="line-through text-muted-foreground text-xs mx-5">
                                    ₹{item.price.toLocaleString()}
                                </span>
                                <Badge variant='destructive' className="text-xs md:text-sm lg:text-sm px-2 py-1 rounded-xs">
                                    {Math.round(
                                        ((item.salePrice - item.price) /
                                            item.salePrice) *
                                        100
                                    )}
                                    % OFF
                                </Badge>
                            </div>
                        </div>

                        {/* ✅ quantity controls */}
                        <div className="flex items-center md:justify-end gap-3 mt-3">
                            <Button
                                variant='outline'
                                disabled={item.qnty === 1}
                                onClick={() => dispatch(decrementQty({ id: item._id }))}
                                className="px-3 py-1 border rounded-xs"
                            >
                                −
                            </Button>

                            <span className="font-semibold px-3 py-1 border rounded-xs">{item.qnty}</span>

                            <Button
                                variant='outline'
                                onClick={() => dispatch(incrementQty({ id: item._id }))}
                                className="px-3 py-1 border rounded-xs"
                            >
                                +
                            </Button>

                            {/* remove */}
                            <Button
                                variant='destructive'
                                onClick={() => dispatch(removeFromCart({ id: item._id }))}
                                className="text-sm"
                            >
                                <Trash/>
                            </Button>
                        </div>
                        {/* item total */}
                        {/* <div className="font-bold text-lg">
                            ₹{(item.salePrice * (item.qnty ?? 0)).toLocaleString()}
                        </div> */}
                    </div>
                ))}
            </div>

            {/* ✅ cart summary */}
            <div className="border-t pt-6 flex justify-between gap-4 items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-3xl font-bold">Total :</h2>
                    <h2 className="text-xl md:text-3xl font-bold text-green-600">
                        ₹{totalAmount.toLocaleString()}
                    </h2>
                </div>
                <Button className="ml-auto text-xs md:text-xl bg-green-500 hover:bg-green-600 text-white md:px-6 px-3 py-3 md:py-6 cursor-pointer rounded-xs">
                    Proceed to Checkout
                </Button>
            </div>
        </div>
    );
}