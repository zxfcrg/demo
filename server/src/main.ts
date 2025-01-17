import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { ControllerLoader } from './utils/controller.loader';
import { RouteRegister } from './utils/route.register';
import path from 'path';

async function bootstrap() {
  const app = express();

  // CORS 配置
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  // 加载所有控制器
  const controllers = await ControllerLoader.loadControllers();
  const router = express.Router();
  RouteRegister.register(router, controllers);
  
  // 注册路由
  app.use('/api', router);

  // SPA 前端路由处理
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // 错误处理中间件
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: '服务器内部错误' });
  });

  return app;
}

async function startServer() {
  try {
    await connectDB();
    console.log('数据库连接成功');
    
    const app = await bootstrap();
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer();
