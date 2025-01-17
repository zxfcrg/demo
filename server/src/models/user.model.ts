import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 保存前对密码进行加密
userSchema.pre('save', async function(next) {
  // 只有密码被修改时才重新加密
  if (!this.isModified('password')) return next();
  
  try {
    // 使用 bcrypt 生成盐值并加密
    const salt = await bcrypt.genSalt(10); // 生成盐值，复杂度为10
    this.password = await bcrypt.hash(this.password, salt); // 使用盐值对密码进行加密
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 