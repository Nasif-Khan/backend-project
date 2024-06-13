import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Connected to DB: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Connetion to DB failed: ${error}`);
        process.exit(1);
    }
} 

export default connectDB;