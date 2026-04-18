import express from 'express'
const app = express();
import cors from 'cors'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();
import connectDB from './config/db.js';
import './config/passport.js';
import { routeImporters } from './middleware/routeImporters.js';
import { errorHandler } from './middleware/errorHandler.js';

const PORT = process.env.PORT || 8000;

// Database Connectivity
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send(`SERVER IS RUNNING ✅ ON PORT ${PORT}`);
});

// route importers
routeImporters(app);

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});