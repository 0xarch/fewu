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

## 尺寸

支持通过```size```设定大小。

<Collapse size="1">
    <Panel header="Default(Medium)">
        size = 1
    </Panel>
</Collapse>
<Collapse size="0">
    <Panel header="Small">
        size = 0
    </Panel>
</Collapse>
<Collapse size="2">
    <Panel header="Large">
        size = 2
    </Panel>
</Collapse>
