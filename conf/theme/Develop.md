# 开发规范

## 基本文件树

themeName
| - main.css
| - color.css
| - widget.css

我们建议：

在color.css中定义主题的所有颜色

在widget.css中定义Widget和其他控件

在main.css中@import以及进行其他操作


## Widget

规范定义的Widget需要包含的class有：

.widget : widget主体

.widget .header : widget标头

.widget .content : widget内容

.widget:not(.nohover):hover : 指针悬浮于widget上

## 其他控件

规范定义的其他控件有：

.wrapperItem 布局项，标准布局包括 .wrapperItem.wrapperLeft , .wrapperItem.wrapperRight , .wrapperItem.wrapperMain 三个类

## GTK 控件

来自 GTK 推荐的控件。

listItem(.listItem)
listBox(.list)
