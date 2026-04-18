// routes/publicRoutes.tsx
import { Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/Layout";
import Home from "@/pages/Home";
import PageNotFound from "@/PageNotFound";
import Products from "@/products-layouting/Products";
import CategoryProduct from "@/pages/products/components/CategoryProducts";
import ViewProduct from "@/pages/products/components/ViewProduct";
import CartItems from "@/pages/cart/CartItems";
import LikeItems from "@/pages/cart/LikeItems";
import CheckOut from "@/pages/checkouts/CheckOut";
import ShopNow from "@/pages/checkouts/ShopNow";
import PaymentSuccess from "@/pages/components/PaymentSuccess";
import PaymentFailed from "@/pages/components/PaymentFailed";

export const  PublicRoutes = () => {
  return (
  <Route
    path="/"
    element={
      <ThemeProvider defaultTheme="light" storageKey="light">
        <Layout />
      </ThemeProvider>
    }
  >
    <Route index element={<Home />} />
    <Route path="products" element={<Products />} />
    <Route path="products/:id" element={<CategoryProduct />} />
    <Route path="products/view/:id" element={<ViewProduct />} />
    <Route path="products/cartitems" element={<CartItems />} />
    <Route path="products/likeditems" element={<LikeItems />} />
    <Route path="products/checkouts" element={<CheckOut />} />
    <Route path="shopnow/:id" element={<ShopNow />} />
    <Route path="success" element={<PaymentSuccess />} />
    <Route path="failed" element={<PaymentFailed />} />
    <Route path="*" element={<PageNotFound url="/" />} />
  </Route>
  );
}