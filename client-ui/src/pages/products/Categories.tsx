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
      setCategories(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) return <CategoriesSkeleton/>

  return (
    <NavigationMenu className="w-full px-1 md:px-10 bg-transparent">
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category._id}>

            {/* CATEGORY */}
            <NavigationMenuTrigger className="text-sm p-1 font-semibold bg-transparent">
              {/* <Link to={`/product/categories/${category._id}`}>{category.categories}</Link> */}
              {category.categories}
            </NavigationMenuTrigger>

            {/* SUBCATEGORY PANEL */}
            <NavigationMenuContent>
              <div className="grid w-85 md:w-125 grid-cols-2 md:grid-cols-3 gap-2 p-3">

                {category.subcategories?.map((sub) => (
                  <div key={sub._id} className="space-y-2">

                    {/* SUBCATEGORY */}
                    <p className="font-medium text-sm cursor-pointer">
                      <Link to={`/product/subcategories/${sub._id}`}>{sub.name}</Link>
                    </p>

                    {/* BRANDS */}
                    <div className="flex flex-col gap-1">
                      {sub.brands?.map((brand) => (
                        <span
                          key={brand}
                          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Link to={`/product/subcategories/${brand}`}>{brand}</Link>
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
    </NavigationMenu>
  )
}