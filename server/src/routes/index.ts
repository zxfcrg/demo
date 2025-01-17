import { Router } from 'express';
import { RouteRegister } from '../utils/route.register';
import { ControllerLoader } from '../utils/controller.loader';

const router = Router();

// 自动加载并注册所有控制器
async function registerRoutes() {
  const controllers = await ControllerLoader.loadControllers();
  RouteRegister.register(router, controllers);
}

// 立即注册路由
registerRoutes().catch(error => {
  console.error('Failed to register routes:', error);
});

export default router; 