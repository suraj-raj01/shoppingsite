# Shopping Site

## Description

This is a shopping site built with Next.js and MongoDB. It allows users to browse and purchase products from a variety of categories.

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart and checkout
- Payment processing
- Order history and tracking

## Technologies

- MongoDB
- React
- Node.js
- Express
- Passport.js
- Razorpay
- Tailwind CSS
- Shadcn UI
- Redux Toolkit

## Folder Structure 

- `client-ui`: The client-side code for the shopping site
- `server`: The server-side code for the shopping site
- `public`: The public assets for the shopping site

```bash
client-ui
    |--- public
    |       |--- tablogo.png
    |       |--- vite.svg
    |--- src
    |   |--- assets
    |   |       |--- react.svg
    |   |--- auth
    |   |       |--- Auth.tsx
    |   |       |--- AuthNavbar.tsx
    |   |       |--- ForgetPassword.tsx
    |   |       |--- Login.tsx
    |   |       |--- LoginLayout.tsx
    |   |       |--- ResetPassword.tsx
    |   |       |--- customers/
    |   |--- chats
    |   |       |--- ChatBot.tsx
    |   |       |--- EnquiryForm.tsx
    |   |--- components
    |   |       |--- access-denied.tsx
    |   |       |--- app-sidebar.tsx
    |   |       |--- footer.tsx
    |   |       |--- login-form.tsx
    |   |       |--- nav-main.tsx
    |   |       |--- nav-projects.tsx
    |   |       |--- nav-user.tsx
    |   |       |--- team-switcher.tsx
    |   |       |--- theme-provider.tsx
    |   |       |--- toggleTheme.tsx
    |   |       |--- ui/
    |   |--- contexts
    |   |       |--- loginContext.tsx
    |   |       |--- userContext.tsx
    |   |--- dashboard
    |   |       |--- Dashboard.tsx
    |   |       |--- DashboardLayout.tsx
    |   |       |--- analytics/
    |   |       |--- authentication/
    |   |       |--- cart/
    |   |       |--- categories/
    |   |       |--- footer/
    |   |       |--- helpers/
    |   |       |--- hero/
    |   |       |--- navbar/
    |   |       |--- orders/
    |   |       |--- products/
    |   |       |--- users/
    |   |--- hooks
    |   |       |--- use-mobile.ts
    |   |--- i18n
    |   |       |--- index.tsx
    |   |       |--- locales/
    |   |--- lib
    |   |       |--- utils.ts
    |   |--- pages
    |   |       |--- Hero.tsx
    |   |       |--- Home.tsx
    |   |       |--- Navbar.tsx
    |   |       |--- cart
    |   |       |       |--- CartItems.tsx
    |   |       |       |--- LikeItems.tsx
    |   |       |--- checkouts
    |   |       |       |--- CheckOut.tsx
    |   |       |       |--- ShopNow.tsx
    |   |       |--- components
    |   |       |       |--- PaymentFailed.tsx
    |   |       |       |--- PaymentSuccess.tsx
    |   |       |--- helpers
    |   |       |       |--- AddtoCart.tsx
    |   |       |       |--- Filtering.tsx
    |   |       |       |--- ScrollToTop.tsx
    |   |       |       |--- SearchProducts.tsx
    |   |       |       |--- SearchProductsMobileView.tsx
    |   |       |       |--- Translate.tsx
    |   |       |       |--- UserInfo.tsx
    |   |       |       |--- WordLimiter.tsx
    |   |       |       |--- getAddress.tsx
    |   |       |       |--- reviewForm.tsx
    |   |       |       |--- reviewRating.tsx
    |   |       |--- products
    |   |       |       |--- AllProducts.tsx
    |   |       |       |--- Categories.tsx
    |   |       |       |--- CategoriesProducts.tsx
    |   |       |       |--- GrossoryProduct.tsx
    |   |       |       |--- RecentlyViewedProducts.tsx
    |   |       |       |--- TrandingProducts.tsx
    |   |       |       |--- components
    |   |       |               |--- CategoryProducts.tsx
    |   |       |               |--- ViewProduct.tsx
    |   |       |--- skeletons
    |   |               |--- FooterSkeleton.tsx
    |   |               |--- FooterSkeleton1.tsx
    |   |               |--- HeroSkeleton.tsx
    |   |               |--- Navbar.tsx
    |   |               |--- products
    |   |                       |--- AllProductSkeleton.tsx
    |   |                       |--- CategoriesSkeleton.tsx
    |   |                       |--- ElectronicProductSkeleton.tsx
    |   |                       |--- ProductViewSkeleton.tsx
    |   |                       |--- TrendingProductsSkeleton.tsx
    |   |--- products-layouting
    |   |       |--- ProductLayout.tsx
    |   |       |--- Products.tsx
    |   |--- redux-toolkit
    |   |       |--- CartSlice.tsx
    |   |       |--- LikeSlice.tsx
    |   |       |--- Store.tsx
    |   |--- routes
    |   |       |--- AuthRoutes.tsx
    |   |       |--- CartItems.tsx
    |   |       |--- CategoryRoutes.tsx
    |   |       |--- DashboardRoutes.tsx
    |   |       |--- Index.tsx
    |   |       |--- OrderRoutes.tsx
    |   |       |--- ProductRoutes.tsx
    |   |       |--- ProfileRoutes.tsx
    |   |       |--- PublicRoutes.tsx
    |   |       |--- RolesPermission.tsx
    |   |       |--- UserRoutes.tsx
    |   |--- App.tsx
    |   |--- Config.tsx
    |   |--- Layout.tsx
    |   |--- PageNotFound.tsx
    |   |--- index.css
    |   |--- main.tsx
    |--- .env
    |--- .gitignore
    |--- components.json
    |--- eslint.config.js
    |--- index.html
    |--- package.json
    |--- package-lock.json
    |--- tsconfig.app.json
    |--- tsconfig.json
    |--- tsconfig.node.json
    |--- vercel.json
    |--- vite.config.ts

server
    |--- config
    |       |--- cloudinary.js
    |       |--- db.js
    |       |--- delete-from-cloudinary.js
    |       |--- passport.js
    |--- controllers
    |       |--- auth/
    |       |--- chatbot/
    |       |--- payments/
    |       |--- products/
    |       |--- returns/
    |       |--- reviews/
    |       |--- site-settings/
    |       |--- uploadImage/
    |--- models
    |       |--- auth/
    |       |--- chatbot/
    |       |--- payments/
    |       |--- products/
    |       |--- returns/
    |       |--- reviews/
    |       |--- site-settings/
    |--- routes
    |       |--- auth/
    |       |--- chatbot/
    |       |--- location/
    |       |--- payments/
    |       |--- products/
    |       |--- returns/
    |       |--- reviews/
    |       |--- site-settings/
    |       |--- upload.js
    |--- middleware
    |       |--- errorHandler.js
    |       |--- isAuthenticated.js
    |       |--- routeImporters.js
    |       |--- sendEmail.js
    |       |--- upload.js
    |--- lib
    |       |--- chatBot.js
    |       |--- rateLimiter.js
    |--- utils
    |       |--- orders/
    |       |--- uploadToCloudinary.js
    |--- app.js
    |--- .env
    |--- package.json
    |--- package-lock.json
    |--- .gitignore

```

## Setup

1. Clone the repository
    ```bash
    git clone https://github.com/suraj-raj01/shoppingsite.git
    ```
2. Install dependencies
    ```bash
    cd shoppingsite
    npm install
    ```
3. Set up environment variables
    ```bash
    cp .env.example .env
    ```
4. Run the development server
    ```bash
    npm run dev
    ```

## Usage

1. Browse products and add them to the shopping cart
2. Checkout and complete the payment process
3. View order history and track orders

## License

MIT

