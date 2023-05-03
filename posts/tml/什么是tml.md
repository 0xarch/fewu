---
title: 什么是TML?
date: 2023-05-03
category: 暂无
---
# TML : 模板标记语言

TML ，即Template Markup Language，是一种**自适应**的模板标记语言。

你可以直接将html嵌入tml中而不需要任何转义，你也可以用类似函数的方式书写模板。

# 简单的格式

1.HTML格式
```html
<div>
    <span class="hello"> Hello! </span>
    <a href="/about"> About </a>
</div>
```

2.混合格式
```
<div>
    <%span#class[hello]> Hello! </span>
    <%a#href[/about]> About </a>
</div>
```

3.函数格式
```
!div{
    !span'[hello]{ Hello! }
    !a.href(/about){ About }
}
```

TML**可以将多种格式混合起来**，比如：
```
!div{
    <%span#class[hello]> Hello! </span>
    <a href="/about"> About </a>
}
```

通过这种看上去很奇怪的方式，TML对\(可能存在的\)旧风格主题有良好的支持。

## 指令

通过对几个主题的分析，我们为 TML 引入了三个基本指令：**if**，**each**，**include**。

### if

对于if，有以下合法格式：

```
<if condition="true">
    <blocks>
</if>
```

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

其中第一种是标准标签，可以被转化为上文提到的其他两种格式(混合、函数)；
第二种是**宏标签**(简写标签)，它们会在解析时被替换为标准标签。

### each

对于each，有以下合法格式：

```html
<each from="array" as="item">
    <blocks>
</each>
```

```
<each:array:item>
    <blocks>
</each>
```

同样的，这两种格式分别为标准标签和宏标签。

### include

```include```实际上是一个替换宏，格式为
```
<include src="foo/bar">
```
这代表解析时，他将被替换为(相对于模板所在目录)foo/bar.tml

```include```同样可以被替换为混合或函数格式。

## 变量

TML使用```@...@```定义变量。

例如：
```
    <a href="@info.about@"> @info.name@ </a>
```