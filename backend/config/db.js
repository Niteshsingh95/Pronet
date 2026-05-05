import mongoose from "mongoose";

const connectDb = async () => {
  try {
    console.log("INSIDE DB:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ DB connected");
  } catch (error) {
    console.log("❌ DB error:", error.message);
    process.exit(1);
  }
};

export default connectDb;