FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 创建静态文件目录
RUN mkdir -p public

RUN npm run build

# 安装 PM2
RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"] 