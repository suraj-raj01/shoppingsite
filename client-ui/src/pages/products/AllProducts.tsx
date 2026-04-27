import { Card } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { limitWords } from "../helpers/WordLimiter"
import ProductsGridSkeleton from "../skeletons/products/AllProductSkeleton"
import { Button } from "@/components/ui/button"

type Product = {
    _id: string
    title: string
    description: string
    defaultImage: string
    name: string
}

export default function AllProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [page, setPage] = useState(0)

    const navigate = useNavigate()

    // ✅ Load Initial Data
    const loadInitialData = useCallback(async () => {
        setLoading(true)
        try {
            const [productsRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/products?limit=12`)
                // 👉 remove categories if not used
            ])

            setProducts(productsRes.data.data || [])
            setPage(1)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    // ✅ Load More (Pagination)
    const loadMore = useCallback(async () => {
        if (loading) return

        setLoading(true)
        try {
            const res = await axios.get(
                `${BASE_URL}/api/admin/products?limit=12&offset=${page * 12}`
            )

            const newData = res.data.data || []

            setProducts(prev => [...prev, ...newData])
            setPage(prev => prev + 1)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [page, loading])

    // ✅ Run on mount
    useEffect(() => {
        loadInitialData()
    }, [loadInitialData])

    // ✅ Memoized chunking (performance boost)
    const chunkedProducts = useMemo(() => {
        const chunks = []
        for (let i = 0; i < products.length; i += 2) {
            chunks.push(products.slice(i, i + 2))
        }
        return chunks
    }, [products])

    // ✅ Loading State
    if (loading && products.length === 0) return <ProductsGridSkeleton />

    if (!products.length) return null

    return (
        <section className="w-full py-6 md:px-5">
            <div className="max-w-full mx-auto md:px-2 px-1">

                <div className="flex md:flex-row flex-col px-1 items-start justify-between">
                    <h2 className="font-semibold text-xl md:py-5">
                        Recently Added Items
                    </h2>
                    <h2 className="md:font-semibold md:text-xl text-sm md:py-5 pb-4">
                        Best Deals On New Products
                    </h2>
                </div>

                {/* ✅ Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">

                    {chunkedProducts.map((group, index) => (
                        <Card key={index} className="p-1 bg-background border-0 rounded-md shadow-none">

                            <div className="grid grid-cols-2 bg-card gap-4 md:gap-2">
                                {group.map((product) => (
                                    <div
                                        key={product._id}
                                        className="cursor-pointer rounded-sm border"
                                        onClick={() => navigate(`/products/view/${product._id}`)}
                                    >
                                        <div className="aspect-4/3 overflow-hidden p-3 rounded-md">
                                            <img
                                                src={product.defaultImage}
                                                alt={product.title}
                                                loading="lazy"
                                                className="w-full h-full p-1 rounded-md object-contain hover:scale-105 transition duration-300"
                                            />
                                        </div>

                                        <p className="text-xs px-2 py-1 text-gray-500">
                                            {limitWords(product?.name, 10)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </Card>
                    ))}
                </div>

                {/* ✅ Load More Button */}
                <div className="flex mt-5 items-center justify-center">
                    <Button
                        onClick={loadMore}
                        disabled={loading || products.length <= 12}
                        variant="outline"
                        className="text-white hover:text-white transition duration-300 hover:bg-[#5089fa] bg-[#6096ff]"
                    >
                        {loading ? "Loading..." : "View More"}
                    </Button>
                </div>

            </div>
        </section>
    )
}