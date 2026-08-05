// import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import { configDotenv } from "dotenv";
configDotenv({
    quiet: true,
})
// dotenv.config({
//     path: './.env'
// })



connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})











