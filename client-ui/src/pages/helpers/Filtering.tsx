import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ProductFilters({ products }: { products: any[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [inStock, setInStock] = useState(false)
  const [priceRange, setPriceRange] = useState([100000])
  const [sortBy, setSortBy] = useState("")

  // ✅ dynamic categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats)
  }, [products])

  // 🧠 Filter Logic (your logic preserved)
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // 🔍 Search
    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 📦 Category
    if (category !== "all") {
      result = result.filter((p) => p.category === category)
    }

    // 📌 In Stock
    if (inStock) {
      result = result.filter((p) => p.stock > 0)
    }

    // 💰 Price
    result = result.filter((p) => p.price <= priceRange[0])

    // 📅 Sorting
    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price)
    }
    if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [search, category, inStock, priceRange, sortBy, products])

  return (
    <div className="space-y-5 sticky top-15 h-screen w-full border-r pr-5 pt-2">
      
      {/* 🔍 Search */}
      <div className="space-y-2">
        <Label className="text-md md:text-xl">Search</Label>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Separator />

      {/* 📦 Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
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

      {/* 💰 Price Range */}
      <div className="space-y-3">
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

      {/* 📌 Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="stock"
          checked={inStock}
          onCheckedChange={(val) => setInStock(!!val)}
        />
        <Label htmlFor="stock">In Stock Only</Label>
      </div>

      <Separator />

      {/* 📅 Sorting */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Price: Low → High</SelectItem>
            <SelectItem value="high">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* 🛒 Results */}
      <Badge variant="secondary" className="w-full justify-center py-2">
        Showing {filteredProducts.length} results
      </Badge>
    </div>
  )
}