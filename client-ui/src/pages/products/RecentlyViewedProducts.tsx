import { Card } from "@/components/ui/card"
import { useRef } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Link, useNavigate } from "react-router-dom"
import type { RootState } from "@/redux-toolkit/Store"
import { useSelector } from "react-redux"

import type { Product } from "@/redux-toolkit/RecentViewSlice"
import { HistoryIcon } from "lucide-react"

export default function RecentlyViewedProduct() {
    const navigate = useNavigate()

    const cartItems: Product[] = useSelector(
        (state: RootState) => state?.addtoView?.view ?? []
    )

    // 🔹 chunk into groups of 4 (for mobile 2x2)
    const chunkProducts = (arr: Product[], size: number) => {
        const result: Product[][] = []
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size))
        }
        return result
    }

    const groupedProducts = chunkProducts(cartItems, 4)

    const autoplay = useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    )

    // ❌ No API → so no loading state needed
    if (!cartItems.length) return null

    return (
        <section className="w-full md:px-5 md:py-10 py-5">
            <div className="max-w-full mx-auto px-2">
                <h2 className="font-semibold text-lg md:text-xl py-5 flex items-center gap-2">
                   <HistoryIcon/> Recently Viewed Products |
                    <span className="md:text-md text-lg text-[#6096ff] cursor-pointer">
                        <Link to="/recently-viewed">View all</Link>
                    </span>
                </h2>

                <Carousel
                    opts={{ loop: true }}
                    plugins={[autoplay.current]}
                    className="w-full"
                >
                    <CarouselContent>

                        {/* ✅ MOBILE VIEW (2x2 grid per slide) */}
                        {groupedProducts.map((group, index) => (
                            <CarouselItem
                                key={`mobile-${index}`}
                                className="basis-full md:hidden"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    {group.map((product) => (
                                        <Card
                                            key={product._id}
                                            className="overflow-auto rounded-sm border p-0"
                                        >
                                            <div className="aspect-4/3 p-2 overflow-hidden">
                                                <img
                                                    src={product.defaultImage}
                                                    alt={product.name}
                                                    onClick={() =>
                                                        navigate(`/products/view/${product._id}`)
                                                    }
                                                    className="w-full h-full object-contain cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm mt-2 pb-1 line-clamp-2 px-2">
                                                    {product.name}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}

                        {/* ✅ DESKTOP VIEW */}
                        {cartItems.map((product) => (
                            <CarouselItem
                                key={`desktop-${product._id}`}
                                className="hidden md:block basis-1/3 md:basis-1/6 lg:basis-1/5"
                            >
                                <Card className="overflow-hidden rounded-sm border p-0 hover:shadow-md transition">
                                    <div className="w-full md:aspect-3/2 aspect-4/3 p-2 overflow-hidden">
                                        <img
                                            src={product.defaultImage}
                                            alt={product.title}
                                            loading="lazy"
                                            onClick={() =>
                                                navigate(`/products/view/${product._id}`)
                                            }
                                            className="w-full h-full object-contain hover:scale-105 transition duration-500 cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm pb-1 line-clamp-2 px-2">
                                            {product.name}
                                        </p>
                                    </div>
                                </Card>
                            </CarouselItem>
                        ))}

                    </CarouselContent>

                    {/* arrows */}
                    <CarouselPrevious className="absolute px-2 md:block hidden bg-background/50 rounded-sm h-20 w-10 left-2 cursor-pointer" />
                    <CarouselNext className="absolute px-2 md:block hidden bg-background/50 rounded-sm h-20 w-10 right-2 cursor-pointer" />
                </Carousel>
            </div>
        </section>
    )
}