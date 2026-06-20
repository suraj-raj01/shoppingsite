# Shopping Site (Monorepo)

This repository contains a full-stack e-commerce application with a React + Vite frontend and an Express + MongoDB backend. The project includes user authentication, product management, shopping cart, checkout (Razorpay), orders, admin dashboard, Cloudinary image uploads, and a simple chatbot/enquiry system.

Key features

- User registration, login (email/password + Google OAuth) and JWT-based auth
- Product listing, categories, search and product detail pages
- Cart, checkout flow and Razorpay payment integration
- Orders, invoices and order history
- Admin dashboard for managing products, users and site settings
- Image upload & management using Cloudinary
- Email sending (verification, notifications) using SMTP
- Simple chatbot / enquiry form backed by Google GenAI

Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Redux Toolkit
- Backend: Node.js, Express, MongoDB (Mongoose), Passport (Google OAuth), Razorpay
- Other: Cloudinary (uploads), Nodemailer (email), Google Gemini API (chatbot), Jest/ESLint (dev tooling)

Repository layout

- [client-ui](client-ui): Vite + React frontend (TypeScript)
- [server](server): Express API, controllers, models, routes and background services

Quickstart (development)

Prerequisites: Node.js (>=18), npm, MongoDB (Atlas or local)

1. Clone the repository

```bash
git clone https://github.com/suraj-raj01/shoppingsite.git
cd shoppingsite
```

2. Start the backend

```bash
cd server
npm install
# create a .env (see required variables below)
npm run dev    # uses nodemon (app runs on PORT)
```

3. Start the frontend

```bash
cd ../client-ui
npm install
npm run dev    # starts Vite dev server (default port 5173)
```

Build for production

Frontend (build static assets):

```bash
cd client-ui
npm run build
```

Backend (start):

```bash
cd server
npm start       # runs node app.js
```

Environment variables (server)

Create a `.env` file in the `server` folder with the following variables (example names):

- `DATABASE_URL` — MongoDB connection string (mongodb://... or mongodb+srv://...)
- `PORT` — Port for the API server (e.g. 4000)
- `CLIENT_URL` — Frontend base URL (e.g. http://localhost:5173)
- `JWT_SECRET` — Secret for signing JWT tokens
- `EMAIL_USER` / `EMAIL_PASS` — SMTP credentials for sending email
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary keys
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — Razorpay API keys
- `GOOGLE_GEMINI_API_KEY` — (optional) API key used by the chatbot

Important: keep `.env` out of source control and never commit secrets.

Where to look in the code

- Server entry and CORS origin: [server/app.js](server/app.js)
- DB connection: [server/config/db.js](server/config/db.js)
- Cloudinary config: [server/config/cloudinary.js](server/config/cloudinary.js)
- Razorpay payment flow: [server/controllers/payments/paymentControllers.js](server/controllers/payments/paymentControllers.js)
- Auth routes (Google OAuth): [server/routes/auth/authRoutes.js](server/routes/auth/authRoutes.js)

Notes & tips

- The frontend is a Vite app (see `client-ui/package.json` scripts). Use `npm run dev` in `client-ui` to start the client.
- The backend uses ES modules (`type: "module"`). Run with `npm run dev` in `server` for development (nodemon).
- If you run frontend and backend locally, ensure `CLIENT_URL` in the server `.env` matches the Vite dev URL.
- For production deployments, build the frontend and host it on a static host (Vercel/Netlify) or serve it from the backend as static assets.

Contributing

Contributions, bug reports and pull requests are welcome. Please open issues for feature requests or bugs.

License

MIT

---
If you want, I can also:

- Add a `server/.env.example` file with safe placeholders
- Add a short CONTRIBUTING.md or PR template
- Update `client-ui/README.md` with component and route maps

Tell me which of those you'd like next.

