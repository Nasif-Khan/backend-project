import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express(); 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.route.js"


// routes the user to the userRouter file in the routes folder
app.use("/api/v1/users", userRouter)
// http://localhost:5000/api/v1/users/register

export {app};