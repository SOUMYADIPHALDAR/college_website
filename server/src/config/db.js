import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDb connected successfully...${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Failed to connect MomgoDb", error.message);
        process.exit(1);
    }
}

export default connectDb;