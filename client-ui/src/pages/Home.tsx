import Hero from "./Hero"
import ElectronicProducts from "./products/ElectronicProducts"
import GrossoryProducts from "./products/GrossoryProduct"

const Home = () => {
  return (
    <div>
      <Hero/>
      <ElectronicProducts/>
      <GrossoryProducts/>
    </div>
  )
}

export default Home;