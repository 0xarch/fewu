# 主题/模板

## 概述

Fewu 通过主题生成网站。主题是 Fewu 不可或缺的一部分。 要开始编写主题，可以参考 Fewu 作者的主题 [Wacal](//github.com/0xarch/nexo-theme-wacal)，这个主题受 GNOME 网站启发而被编写。

## 结构

Fewu 的主题是一个目录。目录中应至少包含以下文件/目录：

* [目录] layouts 网页模板
* [目录] files 网页资源，如 CSS 和 JS
* [目录] extra 主题资源，如 i18n 文件和插件脚本
* [文件] theme.json 主要的主题配置文件
* [文件] variables.json 主题变量的配置文件

## theme.json

### operations
`*ThemeOperation[]` 操作。

### plugin
`boolean` 是否启用插件。默认为`false`。

### Modules.*
`object` 模块配置。根据 Fewu 模块标准，模块应当读取`Modules.{{moduleName}}`的信息。

### parser
`string` 使用的模块解析器名。

### template
`string<PathLike>` 生成博文使用的模板文件名，在 layouts 目录下查找。

### layouts
`*ThemeLayout[]` 页面生成配置。 

### name[可选]
`string` 主题名，无实际作用。

### author[可选]
`string` 作者，无实际作用。

### thanks[可选]
`string` 致谢，无实际作用。

### description[可选]
`string` 主题描述，无实际作用。

### lib[可选]
`string[]` 主题依赖的库，无实际作用。

## variables.json

包括一个 JSON object，作为主题变量的默认值使用。

## extra

存放 i18n 文件和 插件。

### i18n 文件

一个 JSON 文件。命名：`i18n.{{LANG}}.json`

处理 i18n 的默认值(回退)文件： `i18n.default.json`

### 插件

插件是一个 可执行的 JavaScript 文件。插件对 Fewu 具有完全的控制权。每个主题只能启用一个插件。

插件会在生成页面前被运行。

插件必须提供一个 `plugin()` 函数。该函数的返回值会被作为导出提供给生成器。可以通过 `plugin` 对象在模板中访问插件导出。

## files

资源目录。

Fewu 在处理时会将此目录**完全复制**到网站同名目录下，即 `{{PUBLIC_DIR}}/files`。

## layouts

模板目录。

此目录应只存放模板文件。 Fewu 在 layouts 小节的每一个部分时都会从这里读取模板文件。 

## *ThemeOperation

`*ThemeOperation` 标识了操作。

每个 `*ThemeOperation` 应至少包含一个 `do` 键。 Fewu 会根据此键对应的值进行相应操作。

## *ThemeLayout

`*ThemeLayout` 标识了页面。

`*ThemeLayout` 的结构：

```jsonc
{
    "name": "标识，无实际意义",
    "from": "一个位于 layouts 目录下的文件",
    "to": "一个相对于 PUBLIC_DIR 的目录",
    "varias": false, // 是否启用 Varias Builder Module. 默认为 false
    "cycling": false, // 是否启用 Cycling Builer Module. 默认为 false
    "option": { // 此小节标识了 Builder Module 的配置
        "varias": {
            // Varias 配置
        },
        "cycling": {
            // Cycling 配置
        }
    }
}
```