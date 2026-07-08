import mongoose from "mongoose";
import { EnvConfig } from "./env.js";
const connectDB = async () => {
  try {
    await mongoose.connect(EnvConfig.DATABASE_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed",error);
    process.exit(1);
  }
};

export default connectDB;
