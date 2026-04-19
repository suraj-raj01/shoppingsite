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
    <NavigationMenu className="w-full bg-background">
      <div className="w-full overflow-x-auto no-scrollbar">
        <NavigationMenuList className="flex min-w-max gap-0 md:px-6 px-2">

          {categories.map((category) => (
            <NavigationMenuItem key={category._id}>

              <NavigationMenuTrigger className="text-xs md:text-sm px-1 py-1 font-semibold whitespace-nowrap bg-background">
                {category.categories}
              </NavigationMenuTrigger>

              <NavigationMenuContent className='w-300'>
                <div className="grid w-85 md:w-125 grid-cols-3 md:grid-cols-3 p-3">
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
              </NavigationMenuContent>

            </NavigationMenuItem>
          ))}

        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}