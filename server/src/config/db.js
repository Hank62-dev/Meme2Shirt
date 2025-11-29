import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connect Mongoose successfully!!");
  } catch (error) {
    console.log("Connect Mongoose fail due to" + error.message);
  }
};

export default connectDB;
