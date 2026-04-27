import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

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

export default function RelatedProduct({ slug }: { slug: string }) {
    const [product, setProduct] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/admin/products/search/${slug}`);
            setProduct(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProduct();
    }, [slug])

    const navigate = useNavigate();

    if (loading) {
        return (
            <section className="py-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Related Products
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="border border-gray-200 rounded-sm shadow-md p-4 bg-white"
                        >
                            {/* Badge */}
                            <Skeleton className="w-16 h-5 mb-2" />

                            {/* Image */}
                            <Skeleton className="w-full h-48 mb-3 rounded" />

                            {/* Title */}
                            <Skeleton className="w-3/4 h-5 mb-2" />

                            {/* Brand */}
                            <Skeleton className="w-1/2 h-4 mb-2" />

                            {/* Category */}
                            <Skeleton className="w-full h-3 mb-3" />

                            {/* Price */}
                            <div className="flex gap-3">
                                <Skeleton className="w-20 h-5" />
                                <Skeleton className="w-16 h-5" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }


    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {product.length > 0 ? (
                    product.map((prod) => (
                        <div key={prod._id} onClick={() => { navigate(`/products/view/${prod._id}`) }} className="border border-gray-200 rounded-sm shadow-md hover:shadow-lg transition-shadow p-3 bg-white">
                            <div className="relative -top-2">
                                <Badge variant='destructive' className="text-xs relative top-1 left-1 px-2 py-1 rounded-xs">
                                    {Math.round(
                                        ((prod?.salePrice - prod.price) /
                                            prod?.salePrice) *
                                        100
                                    )}
                                    % OFF
                                </Badge>
                            </div>
                            <img src={prod.defaultImage} alt={prod.name} className="w-full h-40 object-contain mb-3 rounded" />
                            <h3 className="text-lg font-semibold text-gray-800 truncate">{prod.name}</h3>
                            <Badge className="text-sm  mb-1">{prod.brand}</Badge>
                            <p className="text-xs text-gray-600 mb-3">{prod.category} - {prod.subcategory}</p>
                            <div className="flex items-center justify-start gap-3">
                                <p className="text-lg font-bold text-[#6096ff]">₹{prod.price.toLocaleString()}</p>
                                <p className="text-md line-through text-red-500">₹{prod.salePrice.toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center py-8">No related products found.</p>
                )}
            </div>
        </section>
    )
}