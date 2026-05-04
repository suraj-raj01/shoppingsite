import { Suspense, lazy, useEffect, useState } from "react"

const ChatBot = lazy(() => import("@/chats/ChatBot"))
const Hero = lazy(() => import("./Hero"))
const AllProducts = lazy(() => import("./products/AllProducts"))
const CategoriesProducts = lazy(() => import("./products/CategoriesProducts"))
import RecentlyViewedProduct from "./products/RecentlyViewedProducts"
import ScrollToTop from "./helpers/ScrollToTop"
import BASE_URL from "@/Config"
import axios from "axios"

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

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/category`)
      setCategories(res.data?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <Suspense fallback={<div></div>}>
      <ScrollToTop/>
      <Hero />
      <AllProducts />
      <RecentlyViewedProduct/>
      {
        categories.map((cat)=>(
          <div>
            <CategoriesProducts title={cat.categories} />
          </div>
        ))
      }
      {/* <CategoriesProducts title="Footwear" />
      <CategoriesProducts title="Hardware" /> */}
      <ChatBot />
    </Suspense>
  )
}

export default Home;