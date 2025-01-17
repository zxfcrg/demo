// 导入express中的Request、Response、NextFunction
import { Request, Response, NextFunction } from 'express';
// 导入reflect-metadata
import 'reflect-metadata';

// 定义路由前缀的常量
export const ROUTER_PREFIX = 'prefix';
// 定义路由路径的常量
export const ROUTER_PATH = 'path';
// 定义路由方法的常量
export const ROUTER_METHOD = 'method';
// 定义路由中间件的常量
export const ROUTER_MIDDLEWARE = 'middleware';

// 定义请求方法的枚举
export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch'
}

// 定义Controller装饰器，用于定义路由前缀
export function Controller(prefix: string = '') {
  return function(target: any) {
    // 使用Reflect.defineMetadata定义路由前缀
    Reflect.defineMetadata(ROUTER_PREFIX, prefix, target);
  }
}

// 定义createMethodDecorator函数，用于创建方法装饰器
function createMethodDecorator(method: RequestMethod) {
  return function(path: string = '') {
    return function(target: any, propertyKey: string) {
      // 使用Reflect.defineMetadata定义路由路径和方法
      Reflect.defineMetadata(ROUTER_PATH, path, target, propertyKey);
      Reflect.defineMetadata(ROUTER_METHOD, method, target, propertyKey);
    }
  }
}

// 定义UseMiddleware装饰器，用于定义路由中间件
export function UseMiddleware(middleware: Array<(req: Request, res: Response, next: NextFunction) => void>) {
  return function(target: any, propertyKey: string) {
    // 使用Reflect.defineMetadata定义路由中间件
    Reflect.defineMetadata(ROUTER_MIDDLEWARE, middleware, target, propertyKey);
  }
}

// 定义Get装饰器，用于定义GET请求
export const Get = createMethodDecorator(RequestMethod.GET);
// 定义Post装饰器，用于定义POST请求
export const Post = createMethodDecorator(RequestMethod.POST);
// 定义Put装饰器，用于定义PUT请求
export const Put = createMethodDecorator(RequestMethod.PUT);
// 定义Delete装饰器，用于定义DELETE请求
export const Delete = createMethodDecorator(RequestMethod.DELETE);
