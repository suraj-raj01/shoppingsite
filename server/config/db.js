import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const Database = process.env.DATABASE_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(Database)

    console.log("✅ Database Connected Successfully!")
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    process.exit(1)
  }
}

export default connectDB