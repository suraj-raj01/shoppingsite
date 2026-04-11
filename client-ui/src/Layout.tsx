import { Outlet } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Footer from "./components/footer";
import Categories from "./pages/products/Categories";
import { useTheme } from "./components/theme-provider";
import { useEffect } from "react";

export default function Layout() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light")
  }, []);

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

