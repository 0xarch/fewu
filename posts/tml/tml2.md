---
title: TML
date: 2023-05-05
category: TML
---

# TML : 模板混合语言

TML ，即Template Mixed Language，是一种**混合语法**的模板语言。

你可以直接将HTML嵌入TML中而不需要任何转义，你也可以用类似函数的方式书写模板。

当前版本：2.0

# 简单的格式

1.HTML格式
```html
<div>
    <span class="hello"> Hello! </span>
    <a href="/about"> About </a>
</div>
```

2.(推荐的)函数格式
```tml
div{
    span'[hello]{ Hello! }
    a.href(/about){ About }
}
```

TML**可以将两种格式混合起来**，比如：
```
div{
    span'[hello]{ Hello! };
    <a href="/about"> About </a>
}
```

通过这种看上去很奇怪的方式，TML对\(可能存在的\)旧写法模板有良好的支持。

# 指令

通过对几个主题的分析，我们为 TML 引入了四个基本指令：**if**，**each**，**include**,**use**。

## if

对于if，有以下合法格式：

```
!if.is(true){
    ...
}
/* 下面是旧写法，但仍然受解析支持 */
!if.condition(true){
    ...
}
```

您也可以使用标准标签的形式书写if语句。

```
<if:true>
    <blocks>
</if>
```
这中带有:分割的简单标签是**宏标签**，它们会在解析时被替换为标准标签。

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
```
each.from(array).as(item){
    ....
}
```

宏标签：
```
<each:array:item>
    <blocks>
</each>
```

## include

```include```实际上是一个**替换宏**，格式为

```
include(foo/bar); /* 推荐的 /
```
```
<include src="foo/bar">
```
```
include.src(foo/bar);
```

这代表解析时，他将被替换为(相对于根模板所在目录)./foo/bar.tml

## use

```use```允许在模板中将长变量改写为短变量。

标准标签：
```html
<use from="foobar" as="fb">
```

函数：
```tml
use.from(foobar).as(fb);
```

宏：
```tml
<use:foobar:fb>
```

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