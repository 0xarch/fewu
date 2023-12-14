---
title: 介绍：MEUI
date: 2023-12-14
category: MEUI
top: false
---

MEUI: 包括主题、组件、页面控制的全新静态页面工具集.

<!--more-->

# 什么是 MEUI

Mata Envolved User Interface (toolkit)，简称MEUI，由原Mata Toolkit/ComponentTeam 分离出来，目标是取代 Mata Toolkit.

# 使用

## 导入

使用模块化技术，使用时仅需引入主文件.

```html
<script type="module" src="meui/js/@v/main.js"></script>
```

```js
import MEUI from './meui/js/@v/main.js';
```

## 配置

### 敬请期待

## 控制

### 网页暗色

MEUI 支持监测用户界面暗色模式.

此块定义于MEUI.browse.darkModeSettings

### 网页布局

MEUI 支持监测用户界面布局方式(PC/Mob)

若使用PC界面，则会将body标签添加属性 shrink="false"

此块定义于MEUI.browse.windowSettings

## 微件

## 组件