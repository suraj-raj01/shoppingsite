import ChatBot from "@/chats/ChatBot"
import Hero from "./Hero"
import AllProducts from "./products/AllProducts"
import CategoriesProducts from "./products/CategoriesProducts"
// import GrossoryProducts from "./products/GrossoryProduct"
import RecentlyViewedProduct from "./products/RecentlyViewedProducts"

const Home = () => {
  return (
    <div>
      <Hero />
      <AllProducts />
      <RecentlyViewedProduct/>
      <CategoriesProducts title="Electronics" />
      <CategoriesProducts title="Footwear" />
      <CategoriesProducts title="Hardware" />
      {/* <GrossoryProducts /> */}
      <ChatBot />
    </div>
  )
}

export default Home;