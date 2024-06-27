import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://keibo:ach0WcM36mBdLsF6@devlog.id9h6ei.mongodb.net/?retryWrites=true&w=majority&appName=DevLog"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // error を any 型として扱うことで、型安全性を確保しつつ error.message にアクセス
    console.error(`Error: ${(error as any).message}`);
    process.exit(1);
  }
};

export default connectDB;
