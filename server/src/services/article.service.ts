import { Article } from '../models/article.model';
import mongoose from 'mongoose';

export class ArticleService {
  async create(title: string, content: string, authorId: string) {
    const article = new Article({
      title,
      content,
      author: new mongoose.Types.ObjectId(authorId)
    });
    await article.save();
    return article;
  }

  async update(articleId: string, authorId: string, updates: { title?: string; content?: string }) {
    const article = await Article.findOne({
      _id: articleId,
      author: authorId
    });

    if (!article) {
      throw new Error('文章不存在或无权限修改');
    }

    if (updates.title) article.title = updates.title;
    if (updates.content) article.content = updates.content;

    await article.save();
    return article;
  }

  async delete(articleId: string, authorId: string) {
    const result = await Article.deleteOne({
      _id: articleId,
      author: authorId
    });

    if (result.deletedCount === 0) {
      throw new Error('文章不存在或无权限删除');
    }

    return true;
  }

  async findById(articleId: string) {
    const article = await Article.findById(articleId).populate('author', 'username');
    if (!article) {
      throw new Error('文章不存在');
    }
    return article;
  }

  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const articles = await Article.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .populate('author', 'username');

    const total = await Article.countDocuments({ $text: { $search: query } });

    return {
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async list(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username');

    const total = await Article.countDocuments();

    return {
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
} 