import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';

// 扩展 Request 类型以包含 user 属性
declare module 'express' {
  interface Request {
    user?: {
      userId: string;
      username: string;
    };
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    // 提取 token（去掉 'Bearer ' 前缀）
    const token = authHeader.split(' ')[1];
    
    // 验证并解码 token
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as {
      userId: string;
      username: string;
    };

    // 将解码后的用户信息设置到 req.user
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };
    
    // 继续处理请求
    next();
  } catch (error) {
    return res.status(401).json({ message: '认证失败' });
  }
}; 