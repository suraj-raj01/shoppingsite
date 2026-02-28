import { Badge } from "@/components/ui/badge";
import BASE_URL from "@/Config";
import AddToCart from "@/pages/helpers/AddtoCart";
import ProductFilters from "@/pages/helpers/Filtering";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate()

  return (
    <section className="px-3 md:px-5 md:flex md:flex-row flex-col gap-5">
      <ProductFilters products={products}/>
      <div className="max-w-full mx-auto">
        {/* 🔹 Header */}
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {id} Products
        </h1>

        {/* 🔹 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-sm py-2 px-1 hover:shadow-md transition bg-white"
            >
              {/* Image */}
              <div className="w-full h-38 flex items-center justify-center overflow-hidden">
                <img
                  src={product.defaultImage}
                  alt={product.name}
                  loading="lazy"
                  className="h-full object-contain cursor-pointer"
                  onClick={() => { navigate(`/products/view/${product._id}`) }}
                />
              </div>

              {/* Info */}
              <div className="mt-4 space-y-1 p-2">
                <p className="text-xs text-gray-400 capitalize">
                  {product.category} • {product.subcategory} • {product.brand}
                </p>

                <h2 className="font-semibold line-clamp-2">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-center justify-between gap-2 mt-2">
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

                  <Badge variant='destructive' className="text-sm px-2 py-1 rounded-xs">
                    {Math.round(
                      ((product.salePrice - product.price) /
                        product.salePrice) *
                      100
                    )}
                    % OFF
                  </Badge>
                </div>
                <div className="w-full flex flex-col gap-2 mt-2">
                  <AddToCart product={product} className="flex "/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );    
}