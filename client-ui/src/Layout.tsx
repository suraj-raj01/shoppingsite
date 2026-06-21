import { Outlet } from "react-router-dom";
import { useTheme } from "./components/theme-provider";
import { useEffect } from "react";
import { Suspense, lazy } from "react";

const Navbar = lazy(() => import("./pages/Navbar"));
const Footer = lazy(() => import("./components/footer"));

export default function Layout() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light")
  }, []);

  return (
    <Suspense fallback={<div></div>}>
      <Navbar />
      <Outlet />
      <Footer />
    </Suspense>
  )
}

