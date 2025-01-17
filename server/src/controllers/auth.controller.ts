import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { Controller, Post, UseMiddleware } from '../decorators/http.decorator';
import { validateUsername, validatePassword } from '../middlewares/validation.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

@Controller('/auth')
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @Post('/register')
  @UseMiddleware([validateUsername, validatePassword])
  async register(req: Request, res: Response) {
    try {
      console.log('Register request:', req.body);
      const { username, password } = req.body;
      const user = await this.authService.register(username, password);
      console.log('User registered:', user);
      res.status(201).json({ 
        message: '注册成功',
        user 
      });
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(400).json({ message: error.message || '注册失败' });
    }
  }

  @Post('/login')
  async login(req: Request, res: Response) {
    try {
      console.log('Login request:', req.body);
      const { username, password } = req.body;
      const result = await this.authService.login(username, password);
      console.log('Login successful for user:', username);
      res.json(result);
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({ message: error.message || '登录失败' });
    }
  }

  @Post('/change-password')
  @UseMiddleware([verifyToken])
  async changePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: '未授权的访问' });
      }

      // 验证新密码
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: '新密码至少需要6个字符' });
      }

      const result = await this.authService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 