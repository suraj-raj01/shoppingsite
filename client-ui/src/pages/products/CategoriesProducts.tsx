import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { ArrowRight, Loader2, ShoppingBag, Sparkles } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { limitWords } from "../helpers/WordLimiter"

type Product = {
    _id: string
    title: string
    description: string
    defaultImage: string
    name: string
    salePrice: number
    price: number
    more: string
}

const PAGE_SIZE = 12
const COLLAGE_SIZE = 5

function getDiscountPercent(salePrice: number, price: number) {
    if (!salePrice || salePrice <= price) return null

    return Math.round(((salePrice - price) / salePrice) * 100)
}

function ProductFrame({
    product,
    featured,
    onClick,
}: {
    product: Product
    featured: boolean
    onClick: () => void
}) {
    const discount = getDiscountPercent(product.salePrice, product.price)

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`View ${product.title || product.name}`}
            className={[
                "group relative overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition duration-300",
                "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#6096ff]/40",
                featured ? "col-span-2 row-span-2" : "col-span-1 row-span-1",
            ].join(" ")}
        >
            <div className="absolute left-2 top-2 z-20 flex flex-wrap items-center gap-1.5">
                {discount ? (
                    <Badge variant="destructive" className="rounded-md px-2 py-1 text-[10px] font-semibold">
                        {discount}% OFF
                    </Badge>
                ) : null}

                {featured ? (
                    <span className="rounded-md bg-slate-950 px-2 py-1 text-[10px] font-semibold text-white">
                        Top Pick
                    </span>
                ) : null}
            </div>

            <div className={featured ? "h-full p-4 pb-20" : "h-full p-3 pb-14"}>
                <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-50 p-3">
                    <img
                        src={product.defaultImage}
                        alt={product.title || product.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 border-t border-slate-100 bg-white/95 px-3 py-2 backdrop-blur">
                <p className={featured ? "text-sm font-semibold text-slate-950" : "text-xs font-medium text-slate-700"}>
                    {limitWords(product?.name, featured ? 14 : 8)}
                </p>

                {featured ? (
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#3468d8]">
                        Shop deal
                        <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                ) : null}
            </div>
        </button>
    )
}

function CollageSkeleton() {
    return (
        <section className="w-full bg-slate-50 px-3 py-8 md:px-7">
            <div className="mx-auto max-w-full">
                <div className="mb-5 h-24 rounded-lg bg-white" />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {[1, 2].map((item) => (
                        <div key={item} className="grid auto-rows-[150px] grid-cols-2 gap-2 rounded-lg bg-white p-2 sm:grid-cols-4 sm:auto-rows-[190px]">
                            <div className="col-span-2 row-span-2 rounded-lg bg-slate-100" />
                            <div className="rounded-lg bg-slate-100" />
                            <div className="rounded-lg bg-slate-100" />
                            <div className="rounded-lg bg-slate-100" />
                            <div className="rounded-lg bg-slate-100" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default function CategoriesProducts({ title }: { title: string }) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()

    const loadProducts = useCallback(async () => {
        setLoading(true)

        try {
            const res = await axios.get(`${BASE_URL}/api/admin/products/search/${title.toLowerCase()}?limit=${PAGE_SIZE}`)
            setProducts(res.data.data || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [title])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    const loadMore = async () => {
        setLoading(true)

        try {
            const res = await axios.get(
                `${BASE_URL}/api/admin/products/search/${title.toLowerCase()}?limit=${PAGE_SIZE}&offset=${products.length}`
            )

            setProducts((currentProducts) => [...currentProducts, ...(res.data.data || [])])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const collageGroups = useMemo(() => {
        const groups: Product[][] = []

        for (let i = 0; i < products.length; i += COLLAGE_SIZE) {
            groups.push(products.slice(i, i + COLLAGE_SIZE))
        }

        return groups
    }, [products])

    if (loading && !products.length) return <CollageSkeleton />
    if (!products.length) return null

    return (
        <section className="w-full px-3 py-8 md:px-7">
            <div className="mx-auto max-w-full">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                            <Sparkles className="h-3.5 w-3.5 text-[#6096ff]" />
                            Discount Upto 30 - 50%
                        </div>

                        <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">
                            Best Deals On {title}
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Shop highlighted picks in a bold collage layout with bigger product frames.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-sm md:rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                        <ShoppingBag className="h-4 w-4 text-emerald-600" />
                        <Link to={`/products/${title.toLowerCase()}`}>Shop Now</Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {collageGroups.map((group, groupIndex) => (
                        <Card key={groupIndex} className="overflow-hidden rounded-lg border-0 bg-transparent shadow-none p-2">
                            <div className="grid auto-rows-[150px] grid-cols-2 gap-2 sm:grid-cols-4 sm:auto-rows-[190px] lg:auto-rows-[205px]">
                                {group.map((product, productIndex) => (
                                    <ProductFrame
                                        key={product._id}
                                        product={product}
                                        featured={productIndex === 0}
                                        onClick={() => navigate(`/products/view/${product._id}`)}
                                    />
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-6 flex w-full items-center justify-center">
                    {products.length >= PAGE_SIZE ? (
                        <Button
                            onClick={loadMore}
                            disabled={loading}
                            className="h-11 rounded-md bg-[#6096ff] px-5 font-semibold text-white shadow-sm transition duration-300 hover:bg-[#5089fa] hover:text-white"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ArrowRight className="mr-2 h-4 w-4" />
                            )}
                            {loading ? "Loading..." : "View More Deals"}
                        </Button>
                    ) : null}
                </div>
            </div>
        </section>
    )
}
