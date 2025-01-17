import mongoose, { Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // 自动管理 createdAt 和 updatedAt
});

// 添加全文搜索索引
articleSchema.index({ title: 'text', content: 'text' });

export const Article = mongoose.model<IArticle>('Article', articleSchema); 