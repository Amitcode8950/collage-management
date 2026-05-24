import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routers.js";
import cors from "cors";
import sendEmail from "./config/email.js";

const app = express();



















app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static("public"));


app.post('/',(req,res)=>{
    res.send("i caming from backend");
})

app.use("/api/auth",userRouter);

export default app;