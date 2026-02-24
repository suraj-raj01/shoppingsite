import { Card, CardContent } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

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

    if (loading) return null

    return (
        <section className="w-full absolute top-95 py-5">
            <div className="max-w-full mx-auto px-2 md:px-2">

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {products.map((product) => (
                        <Card
                            key={product._id}
                            className="overflow-hidden flex items-start justify-between p-1 rounded-xs hover:shadow-md transition"
                        >
                            {/* Image */}
                            <div className="w-full aspect-3/2 overflow-hidden">
                                <img
                                    src={product.defaultImage}
                                    alt={product.title}
                                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                />
                            </div>

                            {/* Content */}
                            <CardContent className="p-1 space-y-1">
                                <h3 className="text-lg font-semibold line-clamp-1">
                                    {product.name}
                                </h3>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.description}
                                </p>
                                <Link to={`/products/${product.category.toLocaleLowerCase()}`} className="font-semibold text-sm text-orange-400">View Details</Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    )
}