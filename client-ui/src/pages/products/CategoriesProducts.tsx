import { Card } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { limitWords } from "../helpers/WordLimiter"
import ProductsGridSkeleton from "../skeletons/products/AllProductSkeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

export default function CategoriesProducts({ title }: { title: string }) {
    const [products, setProducts] = useState<Product[]>([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(true)

    const loadProducts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/products/search/${title.toLocaleLowerCase()}?limit=12`)
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
            const res = await axios.get(`${BASE_URL}/api/admin/products/search/${title.toLocaleLowerCase()}?limit=12&offset=${products.length}`)
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
    for (let i = 0; i < products.length; i += 2) {
        chunkedProducts.push(products.slice(i, i + 2))
    }

    return (
        <section className="w-full py-6 md:px-5">
            <div className="max-w-full mx-auto md:px-2 px-1">
                <div className="flex md:flex-row flex-col items-center justify-between">
                    <h2 className="font-bold text-xl md:py-5">Discount Upto 30 - 50% | Shop Now </h2>
                    <h2 className="md:font-bold md:text-xl md:py-5 pb-4">Best Deals On {title} </h2>
                </div>
                {/* 🔥 Outer Grid (Boxes) */}
                <div className="grid grid-cols-1 py-2 rounded-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">

                    {chunkedProducts.map((group, index) => (
                        <Card key={index} className="p-1 bg-background border-0 rounded-sm shadow-none">

                            {/* 🔥 Inner Grid (4 items inside box) */}
                            <div className="grid grid-cols-2 rounded-sm gap-5 md:gap-2">
                                {group.map((product) => (
                                    <div
                                        key={product._id}
                                        className="cursor-pointer rounded-sm border"
                                        onClick={() => navigate(`/products/view/${product._id}`)}
                                        >
                                        <div>
                                            <Badge variant='destructive' className="text-xs relative top-1 left-1 px-2 py-1 rounded-xs">
                                                {Math.round(
                                                    ((product?.salePrice - product.price) /
                                                        product?.salePrice) *
                                                    100
                                                )}
                                                % OFF
                                            </Badge>
                                        </div>
                                        <div className="aspect-4/3 overflow-hidden p-3 rounded-md">
                                            <img
                                                src={product.defaultImage}
                                                alt={product.title}
                                                loading="lazy"
                                                className="w-full h-full p-1 rounded-sm object-cover hover:scale-105 transition duration-300"
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
                    {products.length < 12 ? ("") : (
                        <Button onClick={loadMore} disabled={loading} variant="outline" className="text-white hover:text-white cursor-pointer transition duration-300 hover:bg-[#5089fa] bg-[#6096ff]">
                            View More
                        </Button>
                    )}
                </div>
            </div>
        </section >
    )
}