import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "No MongoDB URI found in environment (MONGO_URI or MONGODB_URI)",
      );
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
