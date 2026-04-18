// routes/modules/orderRoutes.tsx
import { Route } from "react-router-dom";

// 📦 Orders
import Orders from "@/dashboard/users/customers/components/orders/Orders";
import Allorders from "@/dashboard/orders/AllOrders";
import OrdersView from "@/dashboard/users/customers/components/orders/OrdersView";
import Invoice from "@/dashboard/users/customers/components/orders/Invoice";

// 💳 Payments
import PaymentsTable from "@/dashboard/users/customers/components/orders/Payments";
import AllPaymentsTable from "@/dashboard/orders/AllPayments";

// ⭐ Reviews
import Reviews from "@/dashboard/users/customers/components/Reviews";
import ReviewView from "@/dashboard/users/customers/components/ViewReview";
import UpdateReview from "@/dashboard/orders/UpdateReview";
import AllReviews from "@/dashboard/orders/AllReviews";

// 🔁 Returns
import Returns from "@/dashboard/users/customers/components/returns/Returns";
import ReturnView from "@/dashboard/users/customers/components/returns/returnView";
import ReturnForm from "@/dashboard/users/customers/components/returns/ReturnsForm";
import AllReturns from "@/dashboard/orders/AllReturns";

export const OrderRoutes = (
  <>
    {/* =========================
        📦 ORDERS
    ========================= */}
    <Route path="orders" element={<Orders />} />                 {/* user */}
    <Route path="allorders" element={<Allorders />} />           {/* admin */}
    <Route path="orders/:id/view" element={<OrdersView />} />
    <Route path="invoice/:id" element={<Invoice />} />

    {/* =========================
        💳 PAYMENTS
    ========================= */}
    <Route path="payments" element={<PaymentsTable />} />        {/* user */}
    <Route path="allpayments" element={<AllPaymentsTable />} />  {/* admin */}

    {/* =========================
        ⭐ REVIEWS
    ========================= */}
    <Route path="reviews" element={<Reviews />} />               {/* user */}
    <Route path="reviews/:id/view" element={<ReviewView />} />
    <Route path="reviews/:id/edit" element={<UpdateReview />} />
    <Route path="allreviews" element={<AllReviews />} />         {/* admin */}

    {/* =========================
        🔁 RETURNS
    ========================= */}
    <Route path="returns" element={<Returns />} />
    <Route path="returns/add" element={<ReturnForm />} />
    <Route path="returns/:id" element={<ReturnForm />} />
    <Route path="returns/:id/view" element={<ReturnView />} />
    <Route path="allreturns" element={<AllReturns />} />         {/* admin */}
  </>
);