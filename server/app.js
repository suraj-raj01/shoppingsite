import express from 'express'
const app = express();
import cors from 'cors'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();
import connectDB from './config/db.js';
import './config/passport.js';
import { loginLimiter } from './lib/rateLimiter.js';

const PORT = process.env.PORT || 8000;

connectDB();
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: 'https://shoppingsite-chi.vercel.app',
    credentials: true
}))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import uploadRoutes from './routes/upload.js'
import heroRoutes from './routes/heroRoutes.js'
import navbarRoutes from './routes/navbarRoutes.js'
import roleRoutes from './routes/auth/rolesRoutes.js'
import permissionRoutes from './routes/auth/permissionRoutes.js'
import userRoutes from './routes/auth/userRoutes.js'
import customerRoutes from './routes/auth/customerRouets.js'
import locationRoutes from './routes/location/locationRoutes.js'
import authRoutes from './routes/auth/authRoutes.js'
import paymentRoutes from './routes/paymentRoute.js'
import reviewRoutes from './routes/reviews/reviewRoutes.js'
import footerRoutes from './routes/footerRoutes.js'
import returnRoutes from './routes/returns/returnRoutes.js'

app.get("/", (req, res) => {
    res.send(`SERVER IS RUNNING ✅ ON PORT ${PORT}`);
});

app.use('/api/admin/category', categoryRoutes)
app.use('/api/admin/upload', uploadRoutes)
app.use('/api/admin/products', productRoutes)
app.use('/api/admin/heroes', heroRoutes)
app.use('/api/admin/navbar', navbarRoutes)
app.use('/api/admin/footer', footerRoutes)
app.use('/api/admin/roles', roleRoutes)
app.use('/api/admin/permissions', permissionRoutes)
// user route
app.use('/api/admin/users', userRoutes)
// customer route
app.use('/api/customers', customerRoutes)
// location route
app.use('/api/location', locationRoutes)
// auth route
app.use('/api/auth', authRoutes, loginLimiter)
// payment route
app.use('/api/payment', paymentRoutes)
// review route
app.use('/api/reviews', reviewRoutes)
// return route
app.use('/api/returns', returnRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});