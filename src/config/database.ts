import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Failed to connect to DB");
  }
};
