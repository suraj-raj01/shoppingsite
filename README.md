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

## Folder Structure

- `client-ui`: The client-side code for the shopping site
- `server`: The server-side code for the shopping site
- `public`: The public assets for the shopping site

```bash
client-ui 
    |--- src
        |--- app
        |--- components
        |--- context
        |--- lib
        |--- auth
        |--- config
        |--- context
        |--- Dashboard
        |--- hooks
        |--- redux-toolikit 
        |--- pages
                |--- cart
                      |--- CartItems.tsx
                      |--- LikeItems.tsx
                |--- checkout
                      |--- Checkout.tsx
                      |--- Payment.tsx
                |--- products
                      |--- Product.tsx
                      |--- ProductList.tsx
                      |--- ProductDetails.tsx
                |--- helpers
                      |--- helpers.ts
                |--- skeletons
                      |--- Skeleton.tsx
                |--- user
        |--- public
        |--- styles
        |--- utils
        |--- app.tsx
        |--- Config.tsx
        |--- index.css
        |--- layout.tsx
        |--- next-env.d.ts
        |--- next.config.js
        |--- postcss.config.js
        |--- README.md
        |--- reportWebVitals.ts
        |--- tailwind.config.js
        |--- tsconfig.json
        |--- vercel.json

server
    |--- config
    |--- controllers
    |--- models
    |--- routes
    |--- middleware
    |--- utils
    |--- uploads
    |--- server.js
    |--- app.js
    |--- .env
    |--- package.json
    |--- package-lock.json
    |--- README.md
    |--- .gitignore
    |--- .env.example
    
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

