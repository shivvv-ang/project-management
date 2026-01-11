import mongoose from "mongoose";
import { config } from "./app.config.js";

const connectDb = async()=>{
    try {
        await mongoose.connect(config.MONGODB_CONNECTION_URI);
        console.log(`Connected to Database`);
    } catch (error) {
        console.log("Error connecting to Database");
        process.exit(1);
    }
}

export default connectDb;