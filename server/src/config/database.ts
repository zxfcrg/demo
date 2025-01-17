import mongoose from 'mongoose';

// 处理 strictQuery 警告
mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loginApp';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 超时时间
      socketTimeoutMS: 45000, // Socket 超时时间
      family: 4, // 强制使用 IPv4
    });
    console.log('Connected to MongoDB at:', MONGODB_URI);

    // 添加连接错误处理
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 