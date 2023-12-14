---
title: MEUI::darkMode，暗色模式适配的一种解决方案.
date: 2023-12-14
category: MEUI
top: false
---

MEUI::darkMode : 暗色模式适配的一种解决方案.

<!--more-->

# 使用

## 入口

```MEUI.browse.darkModeSettings```，下文定义为```@darkModeSettings```.

## 监听

### 代码

```js
@darkModeSettings.setMode();
```

此方法将对用户启用暗色模式进行监听.

### 输出

若用户界面为亮色，则为```document.body```添加```light```类.否则，添加```dark```类.