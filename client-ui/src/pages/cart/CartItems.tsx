import type { AppDispatch, RootState } from "@/redux-toolkit/Store";
import { useDispatch, useSelector } from "react-redux";
import {
    itemInc as incrementQty,
    itemDec as decrementQty,
    itemDel as removeFromCart
} from "@/redux-toolkit/CartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../helpers/ScrollToTop";

export default function CartItems() {
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector(
        (state: RootState) => state.addtoCart.cart ?? []
    );
    const navigate = useNavigate();

    const totalMRP = cartItems.reduce(
        (acc, item) => acc + item.price * (item.qnty ?? 0), 0
    );
    const totalSalePrice = cartItems.reduce(
        (acc, item) => acc + item.salePrice * (item.qnty ?? 0), 0
    );
    const totalSavings = totalMRP - totalSalePrice;
    const totalItems = cartItems.reduce(
        (acc, item) => acc + (item.qnty ?? 0), 0
    );

    // ── Empty state ──────────────────────────────────────────────
    if (cartItems.length < 1) {
        return (
            <div className="min-h-screen bg-[#f5f7ff] flex flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-[#eef1ff] flex items-center justify-center">
                    <ShoppingCart className="w-11 h-11 text-[#6096ff]" strokeWidth={1.5} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">Your cart is empty</h2>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                        Looks like you haven't added anything yet. Browse our products and find something you love.
                    </p>
                </div>
                <Button
                    onClick={() => navigate("/products")}
                    className="bg-[#6096ff] hover:bg-[#5089fa] text-white px-8 py-2.5 rounded-sm text-sm font-semibold"
                >
                    Start Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7ff]">
            <ScrollToTop />

            <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5">

                {/* ── Header ── */}
                <div className="flex items-center gap-3">
                    <button
                        title="Go Back"
                        onClick={() => navigate(-1)}
                        className="p-1.5 rounded-full hover:bg-white transition-colors text-slate-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6 text-[#6096ff]" />
                            Shopping Cart
                        </h1>
                        <p className="text-sm text-slate-400">
                            {totalItems} {totalItems === 1 ? "item" : "items"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-5">

                    {/* ── Cart Items ── */}
                    <div className="flex-1 space-y-3">
                        {cartItems.map((item) => {
                            // ✅ Fixed: was (salePrice - price) which gives negative
                            const discount = Math.round(
                                ((item.price - item.salePrice) / item.price) * 100
                            );
                            const itemTotal = item.salePrice * (item.qnty ?? 0);

                            return (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-lg border border-slate-100 p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* Product image */}
                                    <div
                                        className="w-24 h-24 md:w-28 md:h-28 shrink-0 bg-slate-50 rounded-md overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`/products/view/${item._id}`)}
                                    >
                                        <img
                                            src={item.defaultImage}
                                            alt={item.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain p-1.5 hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <h2
                                                className="font-semibold text-slate-800 text-sm md:text-base line-clamp-2 cursor-pointer hover:text-[#6096ff] transition-colors"
                                                onClick={() => navigate(`/products/view/${item._id}`)}
                                            >
                                                {item.name}
                                            </h2>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {item.brand}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                <span className="text-base md:text-lg font-bold text-slate-900">
                                                    ₹{item.salePrice.toLocaleString()}
                                                </span>
                                                <span className="text-xs line-through text-slate-400">
                                                    ₹{item.price.toLocaleString()}
                                                </span>
                                                {discount > 0 && (
                                                    <Badge className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-sm font-semibold hover:bg-emerald-50">
                                                        {discount}% OFF
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Controls row */}
                                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                            {/* Quantity stepper */}
                                            <div className="flex items-center border border-slate-200 rounded-sm overflow-hidden">
                                                <button
                                                    title="Decrease quantity"
                                                    disabled={item.qnty === 1}
                                                    onClick={() => dispatch(decrementQty({ id: item._id }))}
                                                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Minus className="w-3 h-3 text-slate-600" />
                                                </button>
                                                <span className="px-4 py-1.5 text-sm font-semibold text-slate-800 border-x border-slate-200 bg-white min-w-10 text-center">
                                                    {item.qnty}
                                                </span>
                                                <button
                                                    title="Increase quantity"
                                                    onClick={() => dispatch(incrementQty({ id: item._id }))}
                                                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3 text-slate-600" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                {/* Per-item total */}
                                                <span className="text-sm font-bold text-[#6096ff]">
                                                    ₹{itemTotal.toLocaleString()}
                                                </span>
                                                {/* Remove */}
                                                <button
                                                    onClick={() => dispatch(removeFromCart({ id: item._id }))}
                                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Continue shopping */}
                        <button
                            onClick={() => navigate("/")}
                            className="text-sm text-[#6096ff] hover:underline flex items-center gap-1.5 pt-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Continue Shopping
                        </button>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:w-80 xl:w-88">
                        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 lg:sticky lg:top-18">
                            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package className="w-4 h-4 text-[#6096ff]" />
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>
                                        Price ({totalItems} {totalItems === 1 ? "item" : "items"})
                                    </span>
                                    <span>₹{totalMRP.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount</span>
                                    <span className="font-medium">− ₹{totalSavings.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery</span>
                                    <span className="text-emerald-600 font-medium">FREE</span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between font-bold text-slate-900 text-base">
                                <span>Total Amount</span>
                                <span>₹{totalSalePrice.toLocaleString()}</span>
                            </div>

                            {/* Savings callout */}
                            {totalSavings > 0 && (
                                <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-sm px-3 py-2 flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <p className="text-xs text-emerald-700 font-medium">
                                        You save ₹{totalSavings.toLocaleString()} on this order
                                    </p>
                                </div>
                            )}

                            {/* ✅ Fixed: useNavigate instead of <Link> inside <Button> */}
                            <Button
                                onClick={() => navigate("/products/checkouts")}
                                className="w-full mt-4 bg-[#6096ff] hover:bg-[#5089fa] text-white py-5 text-sm font-semibold rounded-sm cursor-pointer"
                            >
                                Proceed to Checkout
                            </Button>

                            <p className="text-center text-xs text-slate-400 mt-3">
                                Safe &amp; Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}