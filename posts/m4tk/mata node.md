---
title: Mata Toolkit in Node.js
date: 2023-07-23
category: MataToolkit Node.js
top: false
---
```Mata Toolkit```(m4tk) 对于 ```Node.js``` 的拓展包：```m4nugs```（尚未上传），
m4nugs是 ```Hogger/utils.js``` 的分支，
支持颜色输出等功能

<!--more-->
# 颜色输出

```js
const M4NU = require("m4nugs");

console.log(M4NU.Colorize('Output Text','GREEN'));
```
这段代码将输出绿色的 "Output Text" 文字.

```js
const M4NU = require("m4nugs");

console.log(M4NU.Colorize('Output Text','GREEN BOLD'));
```
这段代码将输出绿色加粗的 "Output Text" 文字.