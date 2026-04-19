
import productRoutes from "../routes/products/productRoutes.js"
import categoryRoutes from "../routes/products/categoryRoutes.js"
import uploadRoutes from '../routes/upload.js'
import heroRoutes from '../routes/site-settings/heroRoutes.js'
import navbarRoutes from '../routes/site-settings/navbarRoutes.js'
import roleRoutes from '../routes/auth/rolesRoutes.js'
import permissionRoutes from '../routes/auth/permissionRoutes.js'
import userRoutes from '../routes/auth/userRoutes.js'
import customerRoutes from '../routes/auth/customerRouets.js'
import locationRoutes from '../routes/location/locationRoutes.js'
import authRoutes from '../routes/auth/authRoutes.js'
import paymentRoutes from '../routes/payments/paymentRoute.js'
import reviewRoutes from '../routes/reviews/reviewRoutes.js'
import footerRoutes from '../routes/site-settings/footerRoutes.js'
import returnRoutes from '../routes/returns/returnRoutes.js'
import { loginLimiter } from '../lib/rateLimiter.js'
import chatRoutes from '../routes/chatbot/chatRoutes.js'
import enquiryRoutes from '../routes/chatbot/enquiryRoutes.js'

export function routeImporters(app){
    // category route
    app.use('/api/admin/category', categoryRoutes)
    // upload route
    app.use('/api/admin/upload', uploadRoutes)
    // product route
    app.use('/api/admin/products', productRoutes)
    // hero route
    app.use('/api/admin/heroes', heroRoutes)
    // navbar route
    app.use('/api/admin/navbar', navbarRoutes)
    // footer route
    app.use('/api/admin/footer', footerRoutes)
    // role route
    app.use('/api/admin/roles', roleRoutes)
    // permission route
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
    // chat route
    app.use('/api/chat', chatRoutes)
    app.use('/api/enquiry', enquiryRoutes)
}