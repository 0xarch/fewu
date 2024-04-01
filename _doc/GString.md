# GString

GString 是 Fewu 使用在配置文件中的一种字符串格式。

## 格式

书写 GString 与书写普通字符串没有太大差别，只需要将标识符转义即可。

### 示例

1. "Got Fewu version: {{FEWU_RELEASE_VERSION}}"
2. "The \\\\{{ Symbol is used to mark a start location. And }} is used to mark a close location."
> 由于字符串在计算时就会先转义一次，所以需要两个转义字符。

## 标识符

### {{

`{{` 标识了 GString 插值起始位置。

### }}

`}}` 标识了 GString 插值结束位置。

## 插值

通过标识符可以在 GString 中标识一个插值区域。此区域应为一个符合 `CollectionGetter` 的字符串。
> `CollectionGetter` 快览：
> 与书写 JavaScript 链条几乎相同。区别在于当属性名中有`.`(点号)时，需要使用转义字符而不是括号+字符串。
> 举例： `Builder.version.Node\.js`
> 注：某些情况下需要写两个转义符(如在一个字符串中)

在计算时，会从一个 `Collection` 中获取对应的值并替换插值区域。可以获取的值取决于开发者在初始化 `Collection` 时界定。