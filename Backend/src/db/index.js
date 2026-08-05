import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { configDotenv } from "dotenv";

configDotenv({
    quiet: true,
});


const connectDB = async () => {
    try {
        const mongoUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        console.log(`Connecting to MongoDB: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@")}`);

        const connectionInstance = await mongoose.connect(mongoUri);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export default connectDB