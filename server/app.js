import express from 'express'
const app = express();
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config();
import connectDB from './config/db.js';
import './config/passport.js';
import { routeImporters } from './middleware/routeImporters.js';
import { errorHandler } from './middleware/errorHandler.js';
const PORT = process.env.PORT;

// Database Connectivity
connectDB();

// Allow client url to communicate with Server
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

const server = http.createServer(app);

// Middlewares
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// error handler
app.use(errorHandler);

// Socket server
const io = new Server(server, {
    cors:{
        origin: ["http://localhost:5173", "https://res.cloudinary.com"],
        methods:["GET","POST"]
    }
});

io.on("connection",(socket)=>{
    console.log(
      "User connected:",
      socket.id
    );
    // receive message from client
    socket.on("send_message",(data)=>{
        console.log(data,"data");
        // send message to all clients
        io.emit(
          "receive_message",
          data
        );
    });
    // disconnect
    socket.on("disconnect",()=>{
        console.log(
          "User disconnected"
        );
    });
});

app.get("/", (req, res) => {
    res.send(`SERVER IS RUNNING ✅ ON PORT ${PORT}`);
});

// route importers
routeImporters(app);

// Server is running on port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});