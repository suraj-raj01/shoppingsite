// routes/dashboardRoutes.tsx
import { Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardLayout from "@/dashboard/DashboardLayout";
import Dashboard from "@/dashboard/Dashboard";
import Notification from "@/dashboard/helpers/Notifications";
import Settings from "@/dashboard/users/customers/components/Settings";
import PageNotFound from "@/PageNotFound";
import { UserRoutes } from "./UserRoutes";
import { OrderRoutes } from "./OrderRoutes";
import { CategoryRoutes } from "./CategoryRoutes";
import { ProfileRoutes } from "./ProfileRoutes";
import { RolesPermission } from "./RolesPermission";
import EnquiryTable from "@/dashboard/users/enquiries/EnquiryTable";
import EnquiryForm from "@/chats/EnquiryForm";
import EnquiryView from "@/dashboard/users/enquiries/EnquiryView";
import Analytics from "@/dashboard/analytics/Analytics";
import { CartItems } from "./CartItems";
import Coupon from "@/dashboard/users/customers/components/Coupon";

// 👉 import grouped modules (better)

export const DashboardRoutes = () => {
  <Route
    path="/dashboard"
    element={
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <DashboardLayout />
      </ThemeProvider>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="notifications" element={<Notification />} />
    <Route path="settings" element={<Settings />} />
    <Route path="vouchers" element={<Coupon />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="enquiriestable" element={<EnquiryTable />} />
    <Route path="enquiries" element={<EnquiryForm />} />
    <Route path="enquiries/:id/view" element={<EnquiryView />} />

    {/* 🔥 Modular routes */}
    {UserRoutes}
    {/* {ProductRoutes} */}
    {OrderRoutes}
    {CategoryRoutes}
    {ProfileRoutes}
    {RolesPermission}
    {CartItems}
    <Route path="*" element={<PageNotFound url="/dashboard" />} />
  </Route>
}