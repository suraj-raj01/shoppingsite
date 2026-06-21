import BASE_URL from "@/Config"
import axios from "axios"
import { useEffect, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import CategoriesSkeleton from "../skeletons/products/CategoriesSkeleton"

type Subcategories = {
  _id: string
  name: string
  brands: string[]
}

type Category = {
  _id: string
  categories: string
  categoriesImg?: string // ✅ promo banner shown on the right of the dropdown
  subcategories: Subcategories[]
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/category`)
      setCategories(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) return <CategoriesSkeleton />

  return (
    <NavigationMenu className="w-full bg-white">
      <div className="w-full overflow-x-auto no-scrollbar">
        <NavigationMenuList className="flex min-w-max gap-0 md:px-6 px-2">

          {categories.map((category) => (
            <NavigationMenuItem key={category._id}>

              <NavigationMenuTrigger className="text-xs md:text-base px-1 cursor-pointer py-1 font-semibold whitespace-nowrap bg-white">
                {category.categories}
              </NavigationMenuTrigger>

              <NavigationMenuContent className="w-4xl">
                <div className="flex w-4xl items-center justify-between gap-4 p-3">

                  {/* Subcategories — left */}
                  <div className="grid flex-1 grid-cols-2 md:grid-cols-3 gap-3">
                    {category.subcategories?.map((sub) => (
                      <div key={sub._id} className="space-y-1">

                        <p className="font-medium text-md cursor-pointer">
                          <Link to={`/products/${sub._id}`}>{sub.name}</Link>
                        </p>

                        <div className="flex flex-col gap-1">
                          {sub.brands?.map((brand) => (
                            <span
                              key={brand}
                              className="text-md text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <Link to={`/products/${brand}`}>{brand}</Link>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo banner — right */}
                  {category.categoriesImg && (
                    <Link
                      to={`/products/${category._id}`}
                      className="relative hidden sm:block w-100 shrink-0 overflow-hidden rounded-md"
                    >
                      <img
                        src={category.categoriesImg}
                        alt={category.categories}
                        loading="lazy"
                        className="h-full w-200 object-cover transition duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5">
                        <span className="text-xs font-medium text-white">
                          {category.categories}
                        </span>
                      </div>
                    </Link>
                  )}

                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}

        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}