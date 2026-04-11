import { Card } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
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
    more: string
}

export default function AllProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(true)

    const loadProducts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/products?limit=12`)
            setProducts(res.data.data || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const loadMore = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/products?limit=12&offset=${products.length}`)
            setProducts([...products, ...res.data.data])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <ProductsGridSkeleton />
    if (!products.length) return null

    // 🔥 Group products into chunks of 4
    const chunkedProducts = []
    for (let i = 0; i < products.length; i += 4) {
        chunkedProducts.push(products.slice(i, i + 4))
    }

    return (
        <section className="w-full py-6 md:px-5">
            <div className="max-w-full mx-auto px-2">
                <div className="flex md:flex-row flex-cols items-center justify-between">
                    <h2 className="font-bold text-xl py-5">Upto 30% off | Shop Now </h2>
                    <h2 className="font-bold text-xl py-5">Best Deals On Electronics </h2>
                </div>
                {/* 🔥 Outer Grid (Boxes) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">

                    {chunkedProducts.map((group, index) => (
                        <Card key={index} className="p-1 bg-background border-0 rounded-md shadow-none">

                            {/* 🔥 Inner Grid (4 items inside box) */}
                            <div className="grid grid-cols-2 gap-5 md:gap-2">
                                {group.map((product) => (
                                    <div
                                        key={product._id}
                                        className="cursor-pointer border"
                                        onClick={() => navigate(`/products/view/${product._id}`)}
                                    >
                                        <div className="aspect-4/3 overflow-hidden p-3 rounded-md">
                                            <img
                                                src={product.defaultImage}
                                                alt={product.title}
                                                loading="lazy"
                                                className="w-full h-full p-1 rounded-md object-cover hover:scale-105 transition duration-300"
                                            />
                                        </div>
                                        <p className="text-xs font-normal px-2 py-1 text-gray-500">
                                            {limitWords(product?.name, 10)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </Card>
                    ))}
                </div>
                <div className="flex mt-5 items-center w-full justify-center">
                    <Button onClick={loadMore} disabled={loading || products.length<12} variant="outline" className="text-white hover:text-white cursor-pointer transition duration-300 hover:bg-[#5089fa] bg-[#6096ff]">
                        View More
                    </Button>
                </div>
            </div>
        </section>
    )
}