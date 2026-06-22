import type { RootState, AppDispatch } from "@/redux-toolkit/Store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { removelikesData } from "@/redux-toolkit/LikeSlice";
// ✅ Import your addToCart action — adjust the name to match your CartSlice export
import AddtoCart from "@/pages/helpers/AddtoCart";
import ScrollToTop from "../helpers/ScrollToTop";

export default function LikeItems() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const likeItems = useSelector(
        (state: RootState) => state.addtoLike.likes
    );

    // ── Empty state ─────────────────────────────────────────────────
    if (!likeItems || likeItems.length < 1) {
        return (
            <div className="min-h-screen bg-[#f5f7ff] flex flex-col items-center justify-center gap-5 p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                    <Heart className="w-11 h-11 text-red-400" strokeWidth={1.5} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">
                        No saved items yet
                    </h2>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                        Tap the heart on any product to save it here for later.
                    </p>
                </div>
                <Button
                    onClick={() => navigate("/products")}
                    className="bg-[#6096ff] hover:bg-[#5089fa] text-white px-8 py-2.5 rounded-sm text-sm font-semibold"
                >
                    Browse Products
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
                            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                            Wishlist
                        </h1>
                        <p className="text-sm text-slate-400">
                            {likeItems.length}{" "}
                            {likeItems.length === 1 ? "saved item" : "saved items"}
                        </p>
                    </div>
                </div>

                {/* ── Grid: 1 col mobile, 2 col md, 3 col lg ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {likeItems.map((item) => {
                        // ✅ Fixed: was (salePrice - price) / salePrice → negative
                        const discount = Math.round(
                            ((item.price - item.salePrice) / item.price) * 100
                        );

                        return (
                            <div
                                key={item._id}
                                className="bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden"
                            >
                                {/* Image area */}
                                <div
                                    className="relative bg-slate-50 flex items-center justify-center h-44 cursor-pointer overflow-hidden"
                                    onClick={() => navigate(`/products/view/${item._id}`)}
                                >
                                    <img
                                        src={item.defaultImage}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-36 w-full object-contain p-2 hover:scale-105 transition-transform duration-200"
                                    />

                                    {/* Discount badge — top-left corner */}
                                    {discount > 0 && (
                                        <span className="absolute top-2 left-2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                            {discount}% OFF
                                        </span>
                                    )}

                                    {/* Remove — top-right corner */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(removelikesData({ id: item._id }));
                                        }}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors shadow-sm"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Product details */}
                                <div className="flex flex-col flex-1 p-3.5 gap-2">
                                    <div>
                                        <h2
                                            className="font-semibold text-slate-800 text-sm line-clamp-2 cursor-pointer hover:text-[#6096ff] transition-colors leading-snug"
                                            onClick={() => navigate(`/products/view/${item._id}`)}
                                        >
                                            {item.name}
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {item.brand}
                                        </p>
                                    </div>

                                    <div className="flex items-baseline gap-2 flex-wrap">
                                        <span className="text-base font-bold text-slate-900">
                                            ₹{item.salePrice.toLocaleString()}
                                        </span>
                                        <span className="text-xs line-through text-slate-400">
                                            ₹{item.price.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* ✅ Add to Cart — the key action missing from the original */}
                                    <AddtoCart product={item as any} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue shopping */}
                <button
                    onClick={() => navigate("/")}
                    className="text-sm text-[#6096ff] hover:underline flex items-center gap-1.5 pt-1"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}