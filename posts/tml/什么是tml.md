---
title: 什么是TML?
date: 2023-05-03
category: TML
---
# TML : 模板标记语言

TML ，即Template Markup Language，是一种**自适应**的模板标记语言。

你可以直接将html嵌入tml中而不需要任何转义，你也可以用类似函数的方式书写模板。

# 简单的格式

**警告** TML2 正在开发，本页面的部分语句可能是过时的

1.HTML格式
```html
<div>
    <span class="hello"> Hello! </span>
    <a href="/about"> About </a>
</div>
```

2.(推荐的)函数格式
```
!div{
    !span'[hello]{ Hello! }
    !a.href(/about){ About }
}
```
注：在**v2.0**版本中，书写时不再需要加感叹号，当然v2.0仍然提供对带感叹号的解析支持

TML**可以将两种格式混合起来**，比如：
```
!div{
    !span'[hello]{ Hello! }; /* 分号可有可无 */
    <a href="/about"> About </a>
}
```

通过这种看上去很奇怪的方式，TML对\(可能存在的\)旧风格主题有良好的支持。

# 指令

TML2 引入了三个基本指令：**if**，**each**，**include**。

## if

对于if，有以下合法格式：

```tml
if.is(true){
    ...
}

!if.condition(true){
    ...
} /* 过时的写法，来自TML1 */
```

您也可以使用标准标签的形式书写if语句。
```html
<if is="true">
    <blocks>
</if>
```

这种带有:分割的简单标签是**宏标签**，它们会在解析时被替换为标准标签。
```
<if:true>
    <blocks>
</if>
```


等价于
```js
if(true){
    ...
}
```

## each

对于each，有以下合法格式：

标准标签：
```html
<each from="array" as="item">
    <blocks>
</each>
```

函数：
each.from(array).as(item){
    ....
}

宏标签：
```
<each:array:item>
    <blocks>
</each>
```

## include

```include```实际上是一个**替换宏**，格式为

```
<include src="foo/bar">
```
```
!include.src(foo/bar); /* 过时的写法，来自TML1 */
```
```
include(foo/bar);
```

这代表解析时，他将被替换为(相对于根模板所在目录)./foo/bar.tml

# 变量

TML使用```@...@```定义变量。

例如：
```
    <a href="@info.about@"> @info.name@ </a>
```

# 注释

使用 \/\* ..... \*\/ 书写注释

# TML2

目前 TML2 正在 TypeScript 上开发（即src/deno），需通过 [**Deno**](https://deno.land) 运行