import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  salePrice: number;
  defaultImage: string;
  slug: string;
};

export default function CategoryProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const { id } = useParams();

  const fetchProductByCategory = async (id: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/products/?category=${id}`
      );
      setProducts(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) fetchProductByCategory(id);
  }, [id]);

  return (
    <div className="p-6">
      {/* 🔹 Header */}
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {id} Products
      </h1>

      {/* 🔹 Empty state */}
      {products.length === 0 && (
        <p className="text-center text-gray-500">
          No products found
        </p>
      )}

      {/* 🔹 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/view/${product._id}`}
            className="border rounded-xl p-4 hover:shadow-lg transition bg-white"
          >
            {/* Image */}
            <div className="w-full h-48 flex items-center justify-center overflow-hidden">
              <img
                src={product.defaultImage}
                alt={product.name}
                className="h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="mt-4 space-y-1">
              <p className="text-sm text-gray-500">
                {product.brand}
              </p>

              <h2 className="font-semibold line-clamp-2">
                {product.name}
              </h2>

              <p className="text-xs text-gray-400 capitalize">
                {product.category} • {product.subcategory}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-green-600">
                  ₹{product.price?.toLocaleString()}
                </span>

                {product.salePrice > product.price && (
                  <span className="text-sm line-through text-gray-400">
                    ₹{product.salePrice?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}