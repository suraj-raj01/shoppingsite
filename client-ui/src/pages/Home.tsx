import { Suspense, lazy } from "react"

const ChatBot = lazy(() => import("@/chats/ChatBot"))
const Hero = lazy(() => import("./Hero"))
const AllProducts = lazy(() => import("./products/AllProducts"))
const CategoriesProducts = lazy(() => import("./products/CategoriesProducts"))
import RecentlyViewedProduct from "./products/RecentlyViewedProducts"
import ScrollToTop from "./helpers/ScrollToTop"

const Home = () => {
  return (
    <Suspense fallback={<div></div>}>
      <ScrollToTop/>
      <Hero />
      <AllProducts />
      <RecentlyViewedProduct/>
      <CategoriesProducts title="Electronics" />
      <CategoriesProducts title="Footwear" />
      <CategoriesProducts title="Hardware" />
      <ChatBot />
    </Suspense>
  )
}

export default Home;