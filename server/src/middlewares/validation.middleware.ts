import { Request, Response, NextFunction } from 'express';

export const validateUsername = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { username } = req.body;
  if (!username || username.length < 3) {
    return res.status(400).json({ message: '用户名至少需要3个字符' });
  }
  next();
};

export const validatePassword = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: '密码至少需要6个字符' });
  }
  next();
}; 