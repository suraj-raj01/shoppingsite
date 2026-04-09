import Hero from "./Hero"
import AllProducts from "./products/AllProducts"
import ElectronicProducts from "./products/ElectronicProducts"
import GrossoryProducts from "./products/GrossoryProduct"

const Home = () => {
  return (
    <div>
      <Hero />
      <AllProducts />
      <ElectronicProducts />
      <GrossoryProducts />
    </div>
  )
}

export default Home;