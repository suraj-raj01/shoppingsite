import Navbar from "@/pages/Navbar";
// import Categories from "@/pages/products/Categories";
import { Outlet } from "react-router-dom";

export default function ProductLayout() {
  return (
    <div>
      <Navbar/>
      {/* <div className="fixed top-15 z-35 w-full border-0 backdrop-blur-md bg-background/50">
        <Categories/>
      </div> */}
      <Outlet/>
    </div>
  )
}

