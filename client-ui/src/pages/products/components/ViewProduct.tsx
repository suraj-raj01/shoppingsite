import { Badge } from "@/components/ui/badge";
import BASE_URL from "@/Config";
import AddtoCart from "@/pages/helpers/AddtoCart";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailsSkeleton from "../../skeletons/products/ProductViewSkeleton";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { likelikesData, removelikesData } from "@/redux-toolkit/LikeSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux-toolkit/Store";

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

export default function ViewProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/admin/products/${id}`
      );
      // console.log(res.data.data[0]);
      setProduct(res.data.data[0] || null);
      setActiveImage(res.data.data[0]?.defaultImage || "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cartItems = useSelector(
    (state: RootState) => state.addtoLike.likes
  );

  const isLiked = cartItems?.some((item) => item._id === product?._id);

  const dispatch = useDispatch();
  const addtoLike = (product: Product) => {
    dispatch(
      likelikesData({
        ...product,
        id: product._id,
        qnty: 1,
      })
    );
  }

  const removeFromLike = (product: Product) => {
    dispatch(
      removelikesData({
        id: product._id,
      })
    );
  }


  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }
  if (!product) {
    return null;
  }


  return (
    <div className="mt-10 px-4 md:px-10 max-w-full mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">

        {/* ================= LEFT SIDE ================= */}
        <div className="lg:sticky top-24 h-fit">

          {/* Main Image */}
          <div className="border rounded-xs p-4 bg-white">
            <img
              src={activeImage || product.defaultImage}
              alt={product.name}
              className="w-full md:h-112.5 object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <div className="absolute top-32 left-5 md:top-8 cursor-pointer border-0 shadow-none -translate-y-1/2 md:left-2 z-15 rounded-full">
              {isLiked ? (
                <Button
                  onClick={() => removeFromLike(product)}
                  variant="outline"
                  size='icon'
                  className="bg-transparent border rounded-full cursor-pointer shadow-none"
                >
                  <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                </Button>
              ) : (
                <Button
                  onClick={() => addtoLike(product)}
                  variant="outline"
                  size='icon'
                  className="bg-transparent border rounded-full cursor-pointer shadow-none"
                >
                  <Heart className="h-6 w-6" />
                </Button>
              )}
            </div>

            {product.images && product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={product.name}
                onMouseEnter={() => setActiveImage(img.url)}
                className={`w-18 h-14 md:w-20 md:h-20 object-contain border rounded-xs cursor-pointer transition ${activeImage === img.url
                  ? "border-green-600"
                  : "border-gray-200"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div>

          {/* Breadcrumb */}
          <p className="text-sm text-gray-400 capitalize">
            {product.category} / {product.subcategory} / {product.brand}
          </p>

          {/* Title */}
          <h1 className="md:text-3xl font-bold mt-2 leading-snug">
            {product.name}
          </h1>

          {/* Price Section */}
          <div className="mt-6 border-t pt-6">

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.price.toLocaleString()}
              </span>

              {product.salePrice > product.price && (
                <>
                  <span className="line-through text-gray-400 text-lg">
                    ₹{product.salePrice.toLocaleString()}
                  </span>

                  <Badge variant='destructive' className="text-sm px-2 py-1 rounded-xs">
                    {Math.round(
                      ((product.salePrice - product.price) /
                        product.salePrice) *
                      100
                    )}
                    % OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <p
                className={`mt-2 font-medium ${product.stock > 0
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {product.stock > 0
                  ? `(${product.stock}) Items left`
                  : "Out of Stock"}
              </p>
            )}
          </div>

          {/* Tags */}
          {product.tags && (
            <div className="flex gap-2 flex-col mt-5">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-50 px-3 py-1 rounded-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Variants */}
          {product.variants && (
            <div className="mt-6">
              <h2 className="font-semibold mb-3">Available Options</h2>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((variant, i) => (
                  <div
                    key={i}
                    style={{ borderColor: variant.value }}
                    className="border-3 rounded-xs px-4 py-1 cursor-pointer hover:border-green-600 transition"
                  >
                    <p className="text-sm font-medium">
                      {variant.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{variant.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Short Description */}
          {product.shortDescription && (
            <div className="mt-8 border-t pt-6">
              <h2 className="font-semibold mb-2">Highlights</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <AddtoCart product={product} />
          </div>
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="mt-16 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">
            Product Description
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}