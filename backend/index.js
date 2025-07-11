import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
let app = express();

let server = http.createServer(app);
 export const io = new Server(server,{
    cors :({
    origin : "http://localhost:5173",
    credentials : true
})
})
let port = process.env.PORT || 5000

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)
export const userShocketMap = new Map()

io.on("connection", (socket)=>{
   
    socket.on("register", (userId)=>{
        userShocketMap.set(userId,socket.id)
    })

    socket.on("disconnect",(socket)=>{
        console.log("user disconnected", socket.id);
    })
})



app.get("/",(req,res)=>{
    res.send('welcome');
})

server.listen(port, ()=>{
    connectDb()
    console.log("server is started");
    
})