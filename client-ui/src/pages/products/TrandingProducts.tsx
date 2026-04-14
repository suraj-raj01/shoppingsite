import { Card, CardContent } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import TrendingProductsSkeleton from "../skeletons/products/TrendingProductsSkeleton"

type Product = {
    _id: string
    title: string
    description: string
    defaultImage: string
    name: string
    category: string
}

export default function TrandingProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/products/trainding`)
            setProducts(res.data.data || [])
            // console.log(res.data.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const navigate = useNavigate()

    if (loading) return <TrendingProductsSkeleton/>

    return (
        <section className="w-full relative -mt-55 md:-mt-65 md:px-5 py-5">
            <div className="max-w-full mx-auto px-2 md:px-2">

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {products.map((product) => (
                        <Card
                            key={product._id}
                            className="overflow-hidden flex items-start justify-between md:p-1 p-0 rounded-sm hover:shadow-md transition"
                        >
                            {/* Image */}
                            <div className="w-full md:aspect-3/2 aspect-3/2 p-1 backdrop-blur-xl overflow-hidden">
                                <img
                                    src={product.defaultImage}
                                    alt={product.title}
                                    loading="lazy"
                                    onClick={() => { navigate(`/products/view/${product._id}`) }}
                                    className="w-auto mx-auto h-full object-cover hover:scale-105 transition duration-500"
                                />
                            </div>

                            {/* Content */}
                            <CardContent className="md:px-1 px-2 space-y-1 md:pb-2">
                                <h3 className="md:text-lg text-sm font-semibold line-clamp-1">
                                    {product.name}
                                </h3>

                                <p className="md:text-sm text-xs text-muted-foreground line-clamp-2">
                                    {product.description}
                                </p>
                                <Link to={`/products/${product.category.toLocaleLowerCase()}`} className="font-semibold md:text-sm text-xs text-[#6096ff]">View Details</Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}