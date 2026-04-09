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

export default function GrossoryProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(true)

    const loadProducts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/products/search/footwear`)
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

    const autoplay = useRef(
        Autoplay({
            delay: 4000, // slide every 3 sec
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    if (loading) return <ElectronicProductsSkeleton />
    if (!products.length) return null

    return (
        <section className="w-full md:px-5 py-6">
            <div className="max-w-full mx-auto px-2">
                <h2 className="font-bold text-xl md:text-2xl py-5">
                    Footwear Products
                    <span className="text-sm ml-5 text-[#6096ff] cursor-pointer">
                        <Link to="/products/footwear">View all</Link>
                    </span>
                </h2>

                <Carousel opts={{ loop: true }}
                    plugins={[autoplay.current]}
                    className="w-full">
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem
                                key={product._id}
                                className="
                  basis-1/1
                  sm:basis-1/3
                  md:basis-1/4
                  lg:basis-1/5
                "
                            >
                                <Card className="overflow-hidden border p-0 hover:shadow-md transition">
                                    <div className="w-full md:aspect-4/3 aspect-4/3 p-1 overflow-hidden">
                                        <img
                                            src={product.defaultImage}
                                            alt={product.title}
                                            loading="lazy"
                                            onClick={() => { navigate(`/products/view/${product._id}`) }}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                        />
                                    </div>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* arrows */}
                    <CarouselPrevious className="absolute bg-background/50 rounded-xs h-20 w-10 left-2 md:left-2 cursor-pointer" />
                    <CarouselNext className="absolute bg-background/50 rounded-xs h-20 w-10 right-2 md:right-2 cursor-pointer" />
                </Carousel>
            </div>
        </section>
    )
}