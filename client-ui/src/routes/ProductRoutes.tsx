// routes/modules/productRoutes.tsx
import { Route } from "react-router-dom";

// 📦 Products (Admin)
import ProductInsert from "@/dashboard/products/ProductForm";
import ProductsTable from "@/dashboard/products/ProductsTable";
import ProductView from "@/dashboard/products/ProductView";

export const ProductRoutes = (
  <>
    <Route path="products" element={<ProductInsert />} />
    <Route path="products/:id" element={<ProductInsert />} />
    <Route path="products/:id/view" element={<ProductView />} />
    <Route path="productstable" element={<ProductsTable />} />
  </>
);