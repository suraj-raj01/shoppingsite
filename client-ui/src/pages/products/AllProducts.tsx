import { Card } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { limitWords } from "../helpers/WordLimiter"
import ProductsGridSkeleton from "../skeletons/products/AllProductSkeleton"

type Product = {
    _id: string
    title: string
    description: string
    defaultImage: string
    name: string
}

// ✅ Deterministic "deal" badge generator — same product always gets the
// same discount/Top Pick tag (no flicker on re-render), no backend change needed.
function hashId(id: string): number {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

function getDiscount(id: string): number {
    return 5 + (hashId(id) % 20) // 5%–24% off
}

function isTopPick(id: string): boolean {
    return hashId(id) % 5 === 0
}

function isFeatured(index: number): boolean {
    return index % 5 === 0 // roughly 1 in 5 tiles is "featured"
}

export default function AllProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const navigate = useNavigate()

    // ✅ Load Initial Data
    const loadInitialData = useCallback(async () => {
        setLoading(true)
        try {
            const [productsRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/products?limit=15`)
            ])

            setProducts(productsRes.data.data || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])


    // ✅ Run on mount
    useEffect(() => {
        loadInitialData()
    }, [loadInitialData])

    // ✅ Tag each product with layout + deal metadata once
    const tagged = useMemo(() => {
        return products.map((product, index) => ({
            product,
            discount: getDiscount(product._id),
            topPick: isTopPick(product._id),
            featured: isFeatured(index),
        }))
    }, [products])

    // ✅ Loading State
    if (loading && products.length === 0) return <ProductsGridSkeleton />

    if (!products.length) return null

    return (
        <section className="w-full py-6 md:px-15">
            <div className="max-w-full mx-auto md:px-2 px-1">

                <div className="flex md:flex-row flex-col px-1 items-start md:items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">
                            Recently Added Items
                        </h2>
                        <p className="text-sm text-slate-600">
                            Shop highlighted picks in a bold collage layout with bigger product frames.
                        </p>
                    </div>
                    <h2 className="font-semibold md:text-xl text-sm md:py-5 mt-3 pb-4">
                        Best Deals On New Products
                    </h2>
                </div>

                {/* ✅ Dense grid — featured tiles take a 2x2 block, everything
                    else auto-packs into the remaining cells (no manual chunking) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 auto-rows-[150px] gap-3 grid-flow-row-dense p-2 md:p-1">
                    {tagged.map(({ product, discount, topPick, featured }) => (
                        <Card
                            key={product._id}
                            onClick={() => navigate(`/products/view/${product._id}`)}
                            className={`relative cursor-pointer overflow-hidden rounded-md border bg-card p-3 shadow-none transition hover:shadow-md ${featured ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                                }`}
                        >
                            {/* Badges */}
                            <div className="absolute left-2 top-2 z-10 flex gap-1.5">
                                <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                    {discount}% OFF
                                </span>
                                {topPick && (
                                    <span className="rounded-sm bg-[#6096ff] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                        Top Pick
                                    </span>
                                )}
                            </div>

                            <div className="flex h-full flex-col">
                                <div className="flex flex-1 items-center justify-center overflow-hidden">
                                    <img
                                        src={product.defaultImage}
                                        alt={product.title}
                                        loading="lazy"
                                        className="h-full w-full object-contain transition duration-300 hover:scale-105"
                                    />
                                </div>

                                <p
                                    className={`px-1 pt-2 text-gray-700 ${featured
                                        ? "text-sm font-medium line-clamp-2"
                                        : "text-xs line-clamp-1"
                                        }`}
                                >
                                    {featured
                                        ? limitWords(product?.name, 16)
                                        : limitWords(product?.name, 8)}
                                </p>

                                {featured && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(`/products/view/${product._id}`)
                                        }}
                                        className="mt-1 flex items-center gap-1 px-1 text-sm font-medium text-[#6096ff] hover:underline"
                                    >
                                        Shop deal <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* ✅ Load More Button */}
                {/* <div className="flex mt-5 items-center justify-center">
                    <Button
                        onClick={loadMore}
                        disabled={loading || products.length <= 12}
                        variant="outline"
                        className="text-white hover:text-white transition duration-300 hover:bg-[#5089fa] bg-[#6096ff]"
                    >
                        {loading ? "Loading..." : "View More"}
                    </Button>
                </div> */}

            </div>
        </section>
    )
}