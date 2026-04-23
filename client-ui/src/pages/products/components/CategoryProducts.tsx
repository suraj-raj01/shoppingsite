import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import BASE_URL from "@/Config";
import AddToCart from "@/pages/helpers/AddtoCart";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScrollToTop from "@/pages/helpers/ScrollToTop";

type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  salePrice: number;
  defaultImage: string;
  stock?: number;
  slug: string;
  currency: string;
};

export default function CategoryProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);

  /* ---------------- FILTER STATES ---------------- */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [priceRange, setPriceRange] = useState([100000]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProductByCategory = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/products/search/${id}`);
      setProducts(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductByCategory(id);
  }, [id]);

  /* ---------------- CATEGORY LIST ---------------- */

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats);
  }, [products]);

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Stock
    if (inStock) {
      result = result.filter((p) => p.stock && p.stock > 0);
    }

    // Price
    result = result.filter((p) => p.price <= priceRange[0]);

    // Sorting
    if (sortBy === "low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "high") result.sort((a, b) => b.price - a.price);

    return result;
  }, [search, category, inStock, priceRange, sortBy, products]);

  /* ---------------- UI ---------------- */

  return (
    <section className="px-3 bg-card md:px-7 md:flex gap-0">
      <ScrollToTop />
      {/* ================= FILTER SIDEBAR ================= */}

      <div className="md:w-1/5 w-full space-y-4 md:sticky top-22 md:h-screen md:border-r md:pr-5 pt-5">

        {/* Search */}
        <div className="space-y-1">
          <Label>Search</Label>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-1">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>

              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price */}
        <div className="space-y-1">
          <Label>Max Price</Label>

          <Slider
            min={0}
            max={100000}
            step={500}
            value={priceRange}
            onValueChange={setPriceRange}
          />

          <p className="text-sm text-muted-foreground">
            Up to ₹{priceRange[0].toLocaleString()}
          </p>
        </div>

        <Separator />

        {/* Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="stock"
            checked={inStock}
            onCheckedChange={(val) => setInStock(!!val)}
          />
          <Label htmlFor="stock">In Stock Only</Label>
        </div>

        <Separator />

        {/* Sorting */}
        <div className="space-y-1">
          <Label>Sort By</Label>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="low">Price: Low → High</SelectItem>
              <SelectItem value="high">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <Badge variant="secondary" className="w-full justify-center py-2">
          Showing {filteredProducts.length} results
        </Badge>
      </div>

      {/* ================= PRODUCT GRID ================= */}

      <div className="md:w-full w-full md:border-r mb-5">

        <h1 className="text-2xl font-bold mb-3 border-b capitalize p-3">
          {filteredProducts.length === 0 ? "" : id}
        </h1>

        {loading ? (
          // 🔄 Loading State (Skeleton UI)
          <div className="grid grid-cols-1 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse border rounded-sm p-4 space-y-3"
              >
                <div className="h-32 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>

        ) : filteredProducts.length === 0 ? (

          // ❌ Empty State
          <div className="flex justify-center items-center h-40">
            <h1 className="text-2xl font-bold text-gray-500">
              No Products Found
            </h1>
          </div>

        ) : (

          // ✅ Data State
          <div className="grid grid-cols-1 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border rounded-sm py-2 px-1 hover:shadow-md transition bg-background"
              >
                {/* Image */}
                <div className="w-full h-38 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.defaultImage}
                    alt={product.name}
                    loading="lazy"
                    className="h-full object-contain cursor-pointer"
                    onClick={() =>
                      navigate(`/products/view/${product._id}`)
                    }
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
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#6096ff]">
                        ₹{product.price?.toLocaleString()}
                      </span>

                      {product.salePrice > product.price && (
                        <span className="text-sm line-through text-gray-400">
                          ₹{product.salePrice?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {product.salePrice > product.price && (
                      <Badge
                        variant="destructive"
                        className="text-sm px-2 py-1 rounded-xs"
                      >
                        {Math.round(
                          ((product.salePrice - product.price) /
                            product.salePrice) *
                          100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>

                  {/* Cart */}
                  <div className="w-full flex flex-col gap-2 mt-2">
                    <AddToCart product={product} className="flex" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}