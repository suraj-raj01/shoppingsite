import type { RootState } from "@/redux-toolkit/Store"
import { useSelector } from "react-redux"
import type { Product } from "@/redux-toolkit/RecentViewSlice"
import { useNavigate } from "react-router-dom"
import ScrollToTop from "./helpers/ScrollToTop"

export default function RecentlyViewed() {
    const navigate = useNavigate()

    const cartItems: Product[] = useSelector(
        (state: RootState) => state?.addtoView?.view ?? []
    )

    if (!cartItems.length) {
        return <p className="p-4 text-gray-500">No recently viewed products</p>
    }

    return (
        <div className="p-3 md:px-8 bg-white min-h-screen">
            <ScrollToTop/>
            <h2 className="text-xl text-center rounded-sm bg-secondary md:bg-white md:text-primary p-2 md:text-2xl md:text-end font-semibold mb-4">
                Recently Viewed Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cartItems.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => navigate(`/products/view/${product._id}`)}
                        className="border rounded-sm p-2 cursor-pointer hover:shadow-md transition"
                    >
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={product.defaultImage}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">
                            {product.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}