import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';

// 定义AuthService类
export class AuthService {
  // 注册方法
  async register(username: string, password: string) {
    // 查找数据库中是否存在相同用户名
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // 如果存在，抛出错误
      throw new Error('用户名已存在');
    }

    // 创建新用户
    const user = new User({ username, password });
    // 保存用户到数据库
    await user.save();

    // 返回用户信息
    return {
      id: user._id,
      username: user.username,
      createdAt: user.createdAt
    };
  }

  // 登录方法
  async login(username: string, password: string) {
    // 查找数据库中是否存在该用户
    const user = await User.findOne({ username });
    if (!user) {
      // 如果不存在，抛出错误
      throw new Error('用户名或密码错误');
    }

    // 比较密码是否匹配
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // 如果不匹配，抛出错误
      throw new Error('用户名或密码错误');
    }

    // 生成token
    console.log('Generating token for user:', user._id);

    // token的payload
    const tokenPayload = {
      userId: user._id.toString(),
      username: user.username
    };
    console.log('Token payload:', tokenPayload);

    // 生成token
    const token = jwt.sign(
      tokenPayload,
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn }
    );

    // 返回token和用户信息
    return { 
      token,
      userId: user._id,
      username: user.username
    };
  }

  // 修改密码方法
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // 查找用户
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证旧密码
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new Error('原密码错误');
    }

    // 更新密码
    user.password = newPassword;
    await user.save();  // 这里会触发 pre save 中间件自动加密新密码

    return { message: '密码修改成功' };
  }
} 