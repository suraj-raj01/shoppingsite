import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const EnquiryView = lazy(() => import("./dashboard/users/enquiries/EnquiryView"));
const EnquiryTable = lazy(() => import("./dashboard/users/enquiries/EnquiryTable"));
const ShopNow = lazy(() => import("./pages/checkouts/ShopNow"));
const Notification = lazy(() => import("./dashboard/helpers/Notifications"));
const ReturnView = lazy(() => import("./dashboard/users/customers/components/returns/returnView"));
const ReturnForm = lazy(() => import("./dashboard/users/customers/components/returns/ReturnsForm"));
const AllReturns = lazy(() => import("./dashboard/orders/AllReturns"));

const FooterForm = lazy(() => import("./dashboard/footer/FooterForm"));
const Invoice = lazy(() => import("./dashboard/users/customers/components/orders/Invoice"));
const FooterView = lazy(() => import("./dashboard/footer/FooterView"));
const FooterTable = lazy(() => import("./dashboard/footer/FooterTable"));

const Voucher = lazy(() => import("./dashboard/users/customers/components/Coupon"));
const Billings = lazy(() => import("./dashboard/users/customers/components/Bilings"));
const Settings = lazy(() => import("./dashboard/users/customers/components/Settings"));
const Allorders = lazy(() => import("./dashboard/orders/AllOrders"));
const AllReviews = lazy(() => import("./dashboard/orders/AllReviews"));
const ReviewView = lazy(() => import("./dashboard/users/customers/components/ViewReview"));
const UpdateReview = lazy(() => import("./dashboard/orders/UpdateReview"));
const PaymentsTable = lazy(() => import("./dashboard/users/customers/components/orders/Payments"));
const AllPaymentsTable = lazy(() => import("./dashboard/orders/AllPayments"));

const CartItems = lazy(() => import("./pages/cart/CartItems"));
const LikeItems = lazy(() => import("./pages/cart/LikeItems"));
const UserLikeItems = lazy(() => import("./dashboard/cart/LikeItems"));
const UserCartItems = lazy(() => import("./dashboard/cart/CartItems"));
const EditProfile = lazy(() => import("./dashboard/users/customers/EditProfile"));
const Orders = lazy(() => import("./dashboard/users/customers/components/orders/Orders"));
const Returns = lazy(() => import("./dashboard/users/customers/components/returns/Returns"));
const Reviews = lazy(() => import("./dashboard/users/customers/components/Reviews"));
const CheckOut = lazy(() => import("./pages/checkouts/CheckOut"));
const OrdersView = lazy(() => import("./dashboard/users/customers/components/orders/OrdersView"));
const PaymentSuccess = lazy(() => import("./pages/components/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/components/PaymentFailed"));

/* =========================================================
   🔐 AUTH (Lazy Loaded)
========================================================= */

const Login = lazy(() => import("./auth/Login"));
const LoginLayout = lazy(() => import("./auth/LoginLayout"));
const Auth = lazy(() => import("./auth/Auth"));
const LoginForm = lazy(() =>
  import("./auth/customers/Login").then(m => ({ default: m.LoginForm }))
);
const Register = lazy(() =>
  import("./auth/customers/Register").then(m => ({ default: m.Register }))
);
const ForgetPassword = lazy(() =>
  import("./auth/ForgetPassword").then(m => ({ default: m.ForgetPassword }))
);
const ResetPassword = lazy(() =>
  import("./auth/ResetPassword").then(m => ({ default: m.ResetPassword }))
);
const AuthSuccess = lazy(() => import("./auth/customers/components/AuthSuccess"));
const AuthFailed = lazy(() => import("./auth/customers/components/AuthFailed"));

/* =========================================================
   🧱 MAIN LAYOUTS
========================================================= */

const Layout = lazy(() => import("./Layout"));
const Home = lazy(() => import("./pages/Home"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const DashboardLayout = lazy(() => import("./dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const ProductLayout = lazy(() => import("./products-layouting/ProductLayout"));

/* =========================================================
   👥 USERS
========================================================= */

const UserForm = lazy(() => import("./dashboard/users/users/UserForm"));
const CustomerTable = lazy(() => import("./dashboard/users/customers/CustomerTable"));
const UserTable = lazy(() => import("./dashboard/users/users/UsersTable"));
const UsersView = lazy(() => import("./dashboard/users/users/UsersView"));
const CustomerView = lazy(() => import("./dashboard/users/customers/CustomerView"));

/* =========================================================
   📦 PRODUCTS
========================================================= */

const Products = lazy(() => import("./products-layouting/Products"));
const CategoryProduct = lazy(() => import("./pages/products/components/CategoryProducts"));
const ViewProduct = lazy(() => import("./pages/products/components/ViewProduct"));

const ProductInsert = lazy(() => import("./dashboard/products/ProductForm"));
const ProductsTable = lazy(() => import("./dashboard/products/ProductsTable"));
const ProductView = lazy(() => import("./dashboard/products/ProductView"));

/* =========================================================
   🗂️ CATEGORIES
========================================================= */

const CategoryForm = lazy(() => import("./dashboard/categories/CategoriesForm"));
const CategoryTable = lazy(() => import("./dashboard/categories/CategoriesTable"));
const CategoriesView = lazy(() => import("./dashboard/categories/CategoriesView"));

/* =========================================================
   🎯 HERO
========================================================= */

const HeroForm = lazy(() => import("./dashboard/hero/HeroForm"));
const HeroTable = lazy(() => import("./dashboard/hero/HeroTable"));
const HeroView = lazy(() => import("./dashboard/hero/HeroView"));

/* =========================================================
   🧭 NAVBAR
========================================================= */

const NavbarForm = lazy(() => import("./dashboard/navbar/NavbarForm"));
const NavbarTable = lazy(() => import("./dashboard/navbar/NavbarTable"));
const NavbarView = lazy(() => import("./dashboard/navbar/NavbarView"));

/* =========================================================
   🔑 AUTH MANAGEMENT
========================================================= */

const RoleTable = lazy(() => import("./dashboard/authentication/roles/RoleTable"));
const PermissionTable = lazy(() => import("./dashboard/authentication/permissions/PermissionTable"));
const ManagePermissions = lazy(() => import("./dashboard/authentication/permissions/ManagePermissions"));  

/* =========================================================
   📊 ANALYTICS
========================================================= */

const Analytics = lazy(() => import("./dashboard/analytics/Analytics"));
const KPI = lazy(() => import("./dashboard/analytics/KPI"));

/* =========================================================
   🚀 APP ROUTER
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        }
      >
        <Routes>
          {/* =================================================
              🌐 PUBLIC ROUTES
          ================================================= */}
          <Route path="/" element={<ThemeProvider defaultTheme='light' storageKey='light'><Layout /></ThemeProvider>}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="*" element={<PageNotFound url="/" />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<CategoryProduct />} />
            <Route path="products/view/:id" element={<ViewProduct />} />
            <Route path="products/cartitems" element={<CartItems />} />
            <Route path="products/likeditems" element={<LikeItems />} />
            <Route path="products/checkouts" element={<CheckOut />} />
            <Route path="shopnow/:id" element={<ShopNow />} />
            <Route path="success" element={<PaymentSuccess />} />
            <Route path="failed" element={<PaymentFailed />} />
            <Route path="*" element={<PageNotFound url="/products" />} />
          </Route>

          {/* =================================================
              🛍️ PRODUCT LAYOUT
          ================================================= */}
          <Route path="/products" element={<ProductLayout />}>
          </Route>

          {/* =================================================
              🔐 AUTH ROUTES
          ================================================= */}
          <Route path="/auth" element={<LoginLayout />}>
            <Route index element={<Auth />} />
            <Route path="adminlogin" element={<Login />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="login-success" element={<AuthSuccess />} />
            <Route path="login-failed" element={<AuthFailed />} />
            <Route path="signup" element={<Register />} />
            <Route path="signup/:id" element={<Register />} />
            <Route path="forgetpassword" element={<ForgetPassword />} />
            <Route path="resetpassword" element={<ResetPassword />} />
            <Route path="*" element={<PageNotFound url="/auth" />} />
          </Route>

          {/* =================================================
              📊 DASHBOARD
          ================================================= */}
          <Route path="/dashboard" element={<ThemeProvider defaultTheme='light' storageKey='theme'><DashboardLayout /></ThemeProvider>}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Dashboard />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="vouchers" element={<Voucher />} />
            <Route path="billing/:id" element={<Billings />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile/:id" element={<EditProfile />} />

            {/* 🔑 Roles & Permissions */}
            <Route path="roles" element={<RoleTable />} />
            <Route path="permissions" element={<PermissionTable />} />
            <Route path="managepermission" element={<ManagePermissions />} />

            {/* 📈 Analytics */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="kpis" element={<KPI />} />

            {/* 📦 Products */}
            <Route path="products" element={<ProductInsert />} />
            <Route path="products/:id" element={<ProductInsert />} />
            <Route path="products/:id/view" element={<ProductView />} />
            <Route path="productstable" element={<ProductsTable />} />

            {/* 🗂️ Categories */}
            <Route path="categories" element={<CategoryForm />} />
            <Route path="categories/:id" element={<CategoryForm />} />
            <Route path="categories/:id/view" element={<CategoriesView />} />
            <Route path="categoriestable" element={<CategoryTable />} />

            {/* 🎯 Hero */}
            <Route path="hero" element={<HeroForm />} />
            <Route path="hero/:id" element={<HeroForm />} />
            <Route path="hero/:id/view" element={<HeroView />} />
            <Route path="herotable" element={<HeroTable />} />

            {/* Footer */}
            <Route path="footer" element={<FooterForm />} />
            <Route path="footer/:id" element={<FooterForm />} />
            <Route path="footer/:id/view" element={<FooterView />} />
            <Route path="footertable" element={<FooterTable />} />

            {/* 🧭 Navbar */}
            <Route path="navbar" element={<NavbarForm />} />
            <Route path="navbar/:id" element={<NavbarForm />} />
            <Route path="navbar/:id/view" element={<NavbarView />} />
            <Route path="navbartable" element={<NavbarTable />} />

            {/* 👥 Users */}
            <Route path="users" element={<UserForm />} />
            <Route path="users/:id" element={<UserForm />} />
            <Route path="users/:id/view" element={<UsersView />} />
            <Route path="userstable" element={<UserTable />} />
            <Route path="customerstable" element={<CustomerTable />} />
            <Route path="customers/:id/view" element={<CustomerView />} />
            {/* enquiries */}
            <Route path="enquiriestable" element={<EnquiryTable />} />
            <Route path="enquiries/:id/view" element={<EnquiryView />} />

            <Route path="likeitems" element={<UserLikeItems />} />
            <Route path="cartitems" element={<UserCartItems />} />
            <Route path="orders" element={<Orders />} />  {/* for users */}
            <Route path="allorders" element={<Allorders />} />  {/* for admins */}
            <Route path="payments" element={<PaymentsTable />} />
            <Route path="orders/:id/view" element={<OrdersView />} />
            <Route path="reviews" element={<Reviews />} />     {/* for users */}
            <Route path="reviews/:id/view" element={<ReviewView />} />
            <Route path="reviews/:id/edit" element={<UpdateReview />} />
            <Route path="allreviews" element={<AllReviews />} />   {/* for admins */}
            <Route path="allpayments" element={<AllPaymentsTable />} />   {/* for admins */}
            <Route path="invoice/:id" element={<Invoice />} />

            <Route path="allreturns" element={<AllReturns />} />    {/* for admins */}

            <Route path="returns" element={<Returns />} />
            <Route path="returns/:id/view" element={<ReturnView />} />
            <Route path="returns/add" element={<ReturnForm />} />
            <Route path="returns/:id" element={<ReturnForm />} />

            <Route path="*" element={<PageNotFound url="/dashboard" />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}