
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
console.log("ENV FILE CHECK:", process.env);
import express from "express"
// import dotenv from "dotenv"//
import connectDb from "./config/db.js"
import authoRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import http from "http"

import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes.js";


const allowedOrigins = [
  "http://localhost:5173",
  "https://pronet-y2bs.onrender.com"
];

let app=express();
let server=http.createServer(app)


app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});

 
app.use(express.json())
app.use(cookieParser())


let port=process.env.PORT || 5000


app.use("/api/auth",authoRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/connection",connectionRouter)
app.use("/api/notification",notificationRouter)

export const userSocketMap=new Map()

io.on("connection",(socket)=>{
  console.log("user connected",socket.id)
  
   socket.on("register",(userId)=>{
    userSocketMap.set(userId.toString(),socket.id)
   console.log("Socket Map:", userSocketMap);
   })
  socket.on("disconnect",()=>{
  console.log("user disconnected",socket.id)
  });
})
connectDb();
server.listen(port,()=>{
  
  console.log(`🚀 Server started on port ${port}`);
  // console.log("server started"); 
}) 

app.get("/", (req, res) => {
  res.send("API is running...");
});
console.log("JWT:", process.env.JWT_SECRET);

