import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { verifyjwt } from './middlewares/auth.middleware.js'

const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true, limit:"20kb"}))
app.use(express.static('public'))
app.use(cookieParser())







//import routes 
import userRoute from "./routes/user.route.js"



app.use("/users", userRoute)


export {app};