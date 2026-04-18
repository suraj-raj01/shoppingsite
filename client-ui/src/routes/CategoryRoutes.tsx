// routes/modules/categoryRoutes.tsx
import { Route } from "react-router-dom";

// 🗂️ Categories (Admin)
import CategoryForm from "@/dashboard/categories/CategoriesForm";
import CategoryTable from "@/dashboard/categories/CategoriesTable";
import CategoriesView from "@/dashboard/categories/CategoriesView";

export const CategoryRoutes = (
  <>
    {/* =========================
        🗂️ CATEGORIES (ADMIN)
    ========================= */}

    {/* List */}
    <Route path="categoriestable" element={<CategoryTable />} />

    {/* Create */}
    <Route path="categories" element={<CategoryForm />} />

    {/* Edit */}
    <Route path="categories/:id" element={<CategoryForm />} />

    {/* View */}
    <Route path="categories/:id/view" element={<CategoriesView />} />
  </>
);