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
import healthRoute from "./routes/health.route.js"
import pgRoute from "./routes/pg.route.js"
import bookingRoute from "./routes/booking.route.js"
import otpRoute from "./routes/otp.route.js";



app.use("/api/v1/pg", pgRoute)
app.use("/api/v1/booking", bookingRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/health", healthRoute)
app.use("/api/v1/otp", otpRoute)

export {app};