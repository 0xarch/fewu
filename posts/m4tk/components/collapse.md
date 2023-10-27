---
title: Mata Toolkit Collapse
date: 2023-10-27
category: MataToolkit
top: false
---

```Mata Toolkit``` 提供组件 ```Collapse``` \(折叠面板)

Collapse可以实现对大量信息的折叠显示.

<!--more-->

# Collapse

## 使用

```html
<Collapse>
    <Panel header="标题">
        ... 内容 ...
    </Panel>
</Collapse>
```

<Collapse>
    <Panel header="标题">
        ... 内容 ...
    </Panel>
</Collapse>

支持多个 Panel 在同一个 Collapse 中，效果：

<Collapse>
    <Panel header="Panel1">
        <h3>Panel 1</h3>
    </Panel>
    <Panel header="Panel2">
        <h3>Panel 2</h3>
    </Panel>
    <Panel header="Panel3">
        <h3>Panel 3</h3>
    </Panel>
</Collapse>

## 手风琴

```html
<Collapse type="accordion">
    <Panel header="Panel1">
        <h3>Panel 1</h3>
    </Panel>
    <Panel header="Panel2">
        <h3>Panel 2</h3>
    </Panel>
    <Panel header="Panel3">
        <h3>Panel 3</h3>
    </Panel>
</Collapse>
```

效果：

<Collapse type="accordion">
    <Panel header="Panel1">
        <h3>Panel 1</h3>
    </Panel>
    <Panel header="Panel2">
        <h3>Panel 2</h3>
    </Panel>
    <Panel header="Panel3">
        <h3>Panel 3</h3>
    </Panel>
</Collapse>

## 对于JS：

提供 CollapseComponent 类用于构建 Collapse 标签.

```js
let collapsecomponent = new CollapseComponent([{"title":"标题","content":"内容"}]);
let collapse = collapsecomponent.renderHTMLElement();
```

<Anchor anchor="md_anchor"></Anchor>

<script>
let collapsecomponent = new CollapseComponent([{"header":"标题","content":"内容"}]);
let collapse = collapsecomponent.renderHTMLElement();
ReplaceAnchorWith("md_anchor",collapse);
</script>