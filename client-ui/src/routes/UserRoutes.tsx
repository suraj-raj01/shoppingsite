// routes/modules/userRoutes.tsx
import { Route } from "react-router-dom";
import UserTable from "@/dashboard/users/users/UsersTable";
import UserForm from "@/dashboard/users/users/UserForm";
import UsersView from "@/dashboard/users/users/UsersView";
import CustomerTable from "@/dashboard/users/customers/CustomerTable";
import CustomerView from "@/dashboard/users/customers/CustomerView";
import { Register } from "@/auth/customers/Register";

export const UserRoutes = (
  <>
    <Route path="userstable" element={<UserTable />} />
    <Route path="users" element={<UserForm />} />
    <Route path="users/:id" element={<UserForm />} />
    <Route path="users/:id/view" element={<UsersView />} />

    <Route path="customerstable" element={<CustomerTable />} />
    <Route path="customers/:id/view" element={<CustomerView />} />
    <Route path="auth/signup" element={<Register />} />
  </>
);