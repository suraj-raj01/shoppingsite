// routes/authRoutes.tsx
import { Route } from "react-router-dom";
import LoginLayout from "@/auth/LoginLayout";
import Auth from "@/auth/Auth";
import Login from "@/auth/Login";
import { LoginForm } from "@/auth/customers/Login";
import { Register } from "@/auth/customers/Register";
import { ForgetPassword } from "@/auth/ForgetPassword";
import { ResetPassword } from "@/auth/ResetPassword";
import AuthSuccess from "@/auth/customers/components/AuthSuccess";
import AuthFailed from "@/auth/customers/components/AuthFailed";
import PageNotFound from "@/PageNotFound";

export const AuthRoutes = () => {
  <Route path="/auth" element={<LoginLayout />}>
    <Route index element={<Auth />} />
    <Route path="adminlogin" element={<Login />} />
    <Route path="login" element={<LoginForm />} />
    <Route path="signup" element={<Register />} />
    <Route path="signup/:id" element={<Register />} />
    <Route path="forgetpassword" element={<ForgetPassword />} />
    <Route path="resetpassword" element={<ResetPassword />} />
    <Route path="login-success" element={<AuthSuccess />} />
    <Route path="login-failed" element={<AuthFailed />} />
    <Route path="*" element={<PageNotFound url="/auth" />} />
  </Route>
}