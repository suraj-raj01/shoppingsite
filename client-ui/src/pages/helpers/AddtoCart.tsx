import { Button } from "@/components/ui/button";
import { addCartData } from "@/redux-toolkit/CartSlice";
import { IndianRupee, ShoppingCart } from "lucide-react";
import { useDispatch } from 'react-redux';

type Product = {
    _id: string;
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    price: number;
    salePrice: number;
    defaultImage: string;
    images?: { url: string }[];
    description?: string;
    shortDescription?: string;
    stock?: number;
    slug: string;
    currency: string;
    tags?: string[];
    variants?: {
        name: string;
        value: string;
        price: number;
        currency: string;
    }[];
};

export default function AddToCart({
    className,
    product,
}: {
    className?: string;
    product: Product;
}) {
    const dispatch = useDispatch();

    const isOutOfStock = product.stock !== undefined && product.stock <= 0;

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        dispatch(
            addCartData({
                ...product,
                id: product._id,
                qnty: 1,
            })
        );
    };

    return (
        <div className={`${className} space-y-4`}>
            {/* Buttons */}
            <div  className={`${className} flex flex-col md:items-center justify-start md:justify-between gap-2 w-full`}>

                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex py-3 font-semibold w-full rounded-xs ${isOutOfStock
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                >
                  <ShoppingCart/>  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                <Button
                    variant="outline"
                    className="flex py-3 font-semibold rounded-xs w-full"
                >
                  <IndianRupee/>  Buy Now
                </Button>
            </div>
        </div>
    );
}