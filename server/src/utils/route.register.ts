import { Router, Request, Response, NextFunction } from 'express';
import { ROUTER_PREFIX, ROUTER_PATH, ROUTER_METHOD, ROUTER_MIDDLEWARE } from '../decorators/http.decorator';
import { RequestMethod } from '../decorators/http.decorator';

export class RouteRegister {
  static register(router: Router, controllers: any[]) {
    controllers.forEach(Controller => {
      const instance = new Controller();
      const prefix = Reflect.getMetadata(ROUTER_PREFIX, Controller) || '';
      const prototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(prototype)
        .filter(name => name !== 'constructor' && typeof prototype[name] === 'function');

      methodNames.forEach(methodName => {
        const path = Reflect.getMetadata(ROUTER_PATH, prototype, methodName) || '';
        const method = Reflect.getMetadata(ROUTER_METHOD, prototype, methodName) as RequestMethod;
        const middlewares = Reflect.getMetadata(ROUTER_MIDDLEWARE, prototype, methodName) || [];
        const handler = prototype[methodName].bind(instance);

        if (path !== undefined && method !== undefined) {
          const fullPath = `${prefix}${path}`;
          console.log(`Registering route: ${method.toUpperCase()} ${fullPath}`);
          
          // 使用类型安全的方式调用路由方法
          switch (method) {
            case RequestMethod.GET:
              router.get(fullPath, ...middlewares, wrapHandler(handler));
              break;
            case RequestMethod.POST:
              router.post(fullPath, ...middlewares, wrapHandler(handler));
              break;
            case RequestMethod.PUT:
              router.put(fullPath, ...middlewares, wrapHandler(handler));
              break;
            case RequestMethod.DELETE:
              router.delete(fullPath, ...middlewares, wrapHandler(handler));
              break;
            case RequestMethod.PATCH:
              router.patch(fullPath, ...middlewares, wrapHandler(handler));
              break;
          }
        }
      });
    });
  }
}

// 包装处理器函数以处理异步错误
function wrapHandler(handler: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
} 