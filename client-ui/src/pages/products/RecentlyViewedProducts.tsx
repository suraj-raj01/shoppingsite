import { Card } from "@/components/ui/card"
import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useRef, useState } from "react"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Link, useNavigate } from "react-router-dom"
import ElectronicProductsSkeleton from "../skeletons/products/ElectronicProductSkeleton"

type Product = {
    _id: string
    title: string
    description: string
    defaultImage: string
    more: string
}

export default function RecentlyViewedProduct() {
    const [products, setProducts] = useState<Product[]>([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(true)

    const loadProducts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/products/search/electronics`)
            setProducts(res.data.data || [])
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    const chunkProducts = (arr: Product[], size: number) => {
        const result = []
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size))
        }
        return result
    }

    const groupedProducts = chunkProducts(products, 4)

    const autoplay = useRef(
        Autoplay({
            delay: 3000, // slide every 3 sec
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    if (loading) return <ElectronicProductsSkeleton />
    if (!products.length) return null

    return (
        <section className="w-full md:px-5 md:py-10 py-5">
            <div className="max-w-full mx-auto px-2">
                <h2 className="font-bold text-xl md:text-xl py-5">
                    Recently Viewed Products |
                    <span className="text-sm md:text-xl text-[#6096ff] cursor-pointer">
                        <Link to="/products/electronics"> View all</Link>
                    </span>
                </h2>

                <Carousel opts={{ loop: true }}
                    plugins={[autoplay.current]}
                    className="w-full">
                    <CarouselContent>

                        {/* ✅ MOBILE VIEW (2x2 per slide) */}
                        {groupedProducts.map((group, index) => (
                            <CarouselItem
                                key={`mobile-${index}`}
                                className="basis-full md:hidden"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    {group.map((product) => (
                                        <Card
                                            key={product._id}
                                            className="overflow-hidden rounded-sm border p-0"
                                        >
                                            <div className="aspect-square p-2 overflow-hidden">
                                                <img
                                                    src={product.defaultImage}
                                                    alt={product.title}
                                                    onClick={() => navigate(`/products/view/${product._id}`)}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}

                        {/* ✅ DESKTOP VIEW (UNCHANGED) */}
                        {products.map((product) => (
                            <CarouselItem
                                key={`desktop-${product._id}`}
                                className="hidden md:block basis-1/3 md:basis-1/4 lg:basis-1/5"
                            >
                                <Card className="overflow-hidden rounded-sm border p-0 hover:shadow-md transition">
                                    <div className="w-full md:aspect-4/3 aspect-4/3 p-2 overflow-hidden">
                                        <img
                                            src={product.defaultImage}
                                            alt={product.title}
                                            loading="lazy"
                                            onClick={() => navigate(`/products/view/${product._id}`)}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                        />
                                    </div>
                                </Card>
                            </CarouselItem>
                        ))}

                    </CarouselContent>

                    {/* arrows */}
                    <CarouselPrevious className="absolute bg-background/50 rounded-sm h-20 w-10 left-2 md:left-2 cursor-pointer" />
                    <CarouselNext className="absolute bg-background/50 rounded-sm h-20 w-10 right-2 md:right-2 cursor-pointer" />
                </Carousel>
            </div>
        </section>
    )
}