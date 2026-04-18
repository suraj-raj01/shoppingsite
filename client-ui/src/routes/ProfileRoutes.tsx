// routes/modules/profileRoutes.tsx
import { Route } from "react-router-dom";

import Dashboard from "@/dashboard/Dashboard";
import EditProfile from "@/dashboard/users/customers/EditProfile";
import Settings from "@/dashboard/users/customers/components/Settings";
import Notification from "@/dashboard/helpers/Notifications";

export const ProfileRoutes = (
  <>
    {/* =========================
        👤 PROFILE
    ========================= */}
    <Route index element={<Dashboard />} />
    <Route path="profile" element={<Dashboard />} />
    <Route path="profile/:id" element={<EditProfile />} />

    {/* ⚙️ Settings */}
    <Route path="settings" element={<Settings />} />

    {/* 🔔 Notifications */}
    <Route path="notifications" element={<Notification />} />
  </>
);