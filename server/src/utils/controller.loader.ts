import fs from 'fs';
import path from 'path';

export class ControllerLoader {
  static async loadControllers(): Promise<any[]> {
    const controllersPath = path.join(__dirname, '../controllers');
    const controllers: any[] = [];

    try {
      const files = fs.readdirSync(controllersPath);
      
      for (const file of files) {
        if (file.endsWith('.controller.ts') || file.endsWith('.controller.js')) {
          // 动态导入控制器
          const module = await import(path.join(controllersPath, file));
          // 获取导出的所有内容
          const exportedItems = Object.values(module);
          // 找到控制器类（通常是带有 @Controller 装饰器的类）
          const controller = exportedItems.find(item => 
            typeof item === 'function' && 
            Reflect.hasMetadata('prefix', item)
          );
          
          if (controller) {
            controllers.push(controller);
          }
        }
      }
      
      return controllers;
    } catch (error) {
      console.error('Error loading controllers:', error);
      return [];
    }
  }
} 