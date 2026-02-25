import { Button } from "@/components/ui/button";
import { addCartData } from "@/redux-toolkit/CartSlice";
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
    product,
}: {
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
        <div className="space-y-4">
            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 w-full">

                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex py-6 font-semibold w-full rounded-xs ${isOutOfStock
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                <Button
                    variant="outline"
                    className="flex py-6 font-semibold rounded-xs w-full"
                >
                    Buy Now
                </Button>
            </div>
        </div>
    );
}