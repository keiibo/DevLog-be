import mongoose from 'mongoose';

const connectDB = async (uri: string): Promise<void> => {
  try {
    const conn = await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // error を any 型として扱うことで、型安全性を確保しつつ error.message にアクセス
    // eslint-disable-next-line no-console
    console.error(`Error: ${(error as any).message}`);
    process.exit(1);
  }
};

export default connectDB;
