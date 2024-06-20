# 可选特征

**可选特征**允许用户通过配置文件指定部分 Fewu 的行为。

## 概念

### 命名空间

用于标识特征的作用域。命名空间标识位于特征的开头，以`:`结尾。

### 路径

用于标识特征的作用域。路径使用`/`作为分隔符。

## 内置可选特征

### fewu:

此命名空间内的特征为全局特征。可能影响生成文件夹结构。

#### fewu:path/flat

禁用层叠文件夹。启用此特征后，所有文章都将生成于根目录。

#### fewu:path/url/autoRoot

启用自动检测根域名。启用此特征后，Fewu 将根据 `Config<>.website.URL` 提供的声明自动解析根域名。

### markdown:

此命名空间内的特征为编译特征。会影响由文章生成的 HTML 文件。

#### markdown:noHeaderId

禁用自动生成标题id功能。

#### markdown:HTMLMinifier

启用 html-minifier 减小生成文件体积。需要在工作目录的 _node\_modules_ 下包含 _html-minifier_。通常情况下只需要`npm i html-minifier`即可解决。

