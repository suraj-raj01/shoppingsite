import { Button } from "@/components/ui/button";
import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
};

export default function ViewProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  const { id } = useParams();

  const fetchProduct = async (id: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/products/${id}`
      );

      const data = res.data.data[0];
      setProduct(data);
      setActiveImage(data?.defaultImage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  if (!product) {
    return (
      <div className="mt-32 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="mt-20 p-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10">
        
        {/* 🔥 LEFT — Images */}
        <div>
          {/* Main Image */}
          <div className="border rounded-2xl p-6 bg-white">
            <img
              src={activeImage || product.defaultImage}
              alt={product.name}
              className="w-full h-100 object-contain"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {product.images?.map((img, i) => (
              <img
                key={i}
                alt={product.name}
                src={img.url}
                onClick={() => setActiveImage(img.url)}
                className={`w-20 h-20 object-contain border rounded-lg cursor-pointer hover:scale-105 transition ${
                  activeImage === img.url
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 🔥 RIGHT — Info */}
        <div>
          <p className="text-sm text-gray-500">{product.brand}</p>

          <h1 className="text-2xl font-bold mt-1 leading-tight">
            {product.name}
          </h1>

          <p className="text-sm text-gray-400 mt-2 capitalize">
            {product.category} • {product.subcategory}
          </p>

          {/* 💰 Price */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-3xl font-bold text-green-600">
              ₹{product.price.toLocaleString()}
            </span>

            {product.salePrice > product.price && (
              <span className="text-lg line-through text-gray-400">
                ₹{product.salePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* 📦 Stock */}
          {product.stock !== undefined && (
            <p
              className={`mt-2 font-semibold ${
                product.stock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          )}

          {/* 📝 Short Description */}
          {product.shortDescription && (
            <p className="mt-6 text-gray-700 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* 🛒 Buttons */}
          <div className="flex gap-4 mt-8">
            <Button className="px-6 py-3 bg-blue-600 text-white rounded-xs font-semibold hover:bg-blue-700 transition">
              Add to Cart
            </Button>

            <Button className="px-6 py-3 border rounded-xs font-semiboldtransition">
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* 📄 Full Description */}
      {product.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-3">
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