import { Button } from "@/components/ui/button"
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

import TrandingProducts from "./products/TrandingProducts"
import Categories from "./products/Categories"
import HeroSkeleton from "./skeletons/HeroSkeleton"
import { Link } from "react-router-dom"

type HeroType = {
  _id: string
  title: string
  description: string
  image: string
  button: string
  link: string
}

export default function Hero() {
  const [hero, setHero] = useState<HeroType[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ autoplay plugin
  const autoplay = useRef(
    Autoplay({
      delay: 4000, // slide every 3 sec
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  const fetchHero = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/heroes`)
      setHero(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHero()
  }, [])

  if (loading)
    return <HeroSkeleton />

  return (
    <section className="w-full">
      <div className="fixed top-15 z-35 w-full border-b backdrop-blur-md bg-background/50">
      <Categories />
      </div>

      {/* ✅ PASS plugins */}
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="w-full"
      >
        <CarouselContent>
          {hero.map((item) => (
            <CarouselItem key={item._id} className="basis-full">
              <div className="relative w-full h-130 md:h-135 lg:h-165 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="max-w-full -mt-20 flex flex-col items-center justify-center mx-auto px-6 space-y-4">
                    <Button
                      className="mt-2 bg-transparent text-gray-100 hover:bg-black/10 hover:text-gray-50 backdrop-blur-2xl"
                      variant="outline"
                    >
                      <Link to={item.link}>{item.button}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <TrandingProducts />

        <CarouselPrevious className="absolute top-55 left-2 md:left-10 cursor-pointer" />
        <CarouselNext className="absolute top-55 right-2 md:right-10 cursor-pointer" />
      </Carousel>
    </section>
  )
}