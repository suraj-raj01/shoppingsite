import ManagePermissions from "@/dashboard/authentication/permissions/ManagePermissions";
import Permission from "@/dashboard/authentication/permissions/PermissionTable";
import Roles from "@/dashboard/authentication/roles/RoleTable";
import { Route } from "react-router-dom";


export const RolesPermission = (
  <>
    {/* =========================
        👤 PROFILE
    ========================= */}
    <Route path="roles" element={<Roles />} />
    <Route path="permissions" element={<Permission />} />
    <Route path="managepermission" element={<ManagePermissions />} />
  </>
);