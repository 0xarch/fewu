# 0xarch.netlify.app

我的个人博客

此仓库同时包含了一个简易的静态博客生成系统(Hogger)

如果你想使用 Hogger , 请按照以下步骤：

## Nodejs

安装 Node.js 及 npm

fork 或 clone 本仓库

删除 posts/* 

使用 ```$ npm install``` 安装依赖

运行 ```node src/main.js build``` 生成

推送到网站上

对于其他功能，请使用 ```node src/main.js help```查看

## Deno

安装 Deno

fork 或 clone 本仓库

删除 posts/* 

运行 ```deno run --allow-read=. --allow-write=. src/deno/main.ts build``` 生成

推送到网站上

对于其他功能，请使用 ```deno run src/deno/main.ts help```查看