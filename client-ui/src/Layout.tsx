import { Outlet } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Footer from "./components/footer";
import Categories from "./pages/products/Categories";

export default function Layout() {
  return (
    <div className="">
      <Navbar />
      <div className="sticky top-15 z-35 bg-background">
        <Categories />
      </div>
      <Outlet />
      <Footer />
    </div>
  )
}

