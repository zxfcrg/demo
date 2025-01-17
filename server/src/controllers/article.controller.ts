import { Request, Response } from 'express';
import { ArticleService } from '../services/article.service';
import { Controller, Get, Post, Put, Delete, UseMiddleware } from '../decorators/http.decorator';
import { verifyToken } from '../middlewares/auth.middleware';

@Controller('/articles')
export class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  @Post('/')
  @UseMiddleware([verifyToken])
  async create(req: Request, res: Response) {
    try {
      console.log('Create article request received');
      console.log('Headers:', req.headers);
      console.log('User:', req.user);
      console.log('Body:', req.body);

      const { title, content } = req.body;

      if (!req.user?.userId) {
        console.log('No user ID in request');
        return res.status(401).json({ message: '未授权的访问' });
      }

      const article = await this.articleService.create(
        title,
        content,
        req.user.userId
      );

      console.log('Article created:', article);
      res.status(201).json(article);
    } catch (error: any) {
      console.error('Create article error:', error);
      res.status(500).json({ message: '创建文章失败' });
    }
  }

  @Put('/:id')
  @UseMiddleware([verifyToken])
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      if (!req.user?.userId) {
        return res.status(401).json({ message: '未授权的访问' });
      }

      const article = await this.articleService.update(
        id,
        req.user.userId,
        { title, content }
      );
      res.json(article);
    } catch (error: any) {
      res.status(400).json({ message: error.message || '更新文章失败' });
    }
  }

  @Delete('/:id')
  @UseMiddleware([verifyToken])
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.articleService.delete(id, req.user!.userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  @Get('/search')
  async search(req: Request, res: Response) {
    try {
      const { q, page, limit } = req.query;
      const result = await this.articleService.search(
        q as string,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  @Get('/:id')
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const article = await this.articleService.findById(id);
      res.json(article);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  @Get('/')
  async list(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;
      const result = await this.articleService.list(
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
} 