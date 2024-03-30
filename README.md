README.md：说明文件。  
README.zh-CN.md：说明文件。

版权所有 (C) 2020-2024 0xarch(soloev) 
本程序为自由软件：你可以依据自由软件基金会所发布的第三版或更高版本的GNU通用公共许可证重新发布、修改本程序。

虽然基于使用目的而发布本程序，但不负任何担保责任，亦不包含适销性或特定目标之适用性的暗示性担保。详见GNU通用公共许可证。

你应该已经收到一份附随此程序的GNU通用公共许可证副本。否则，请参阅 <http://www.gnu.org/licenses/>。

# Fewu

`Fewu` 是一个自动化静态博客生成器。
> 注意：你可以在 npm 上看见这个东西了！

## 使用 Fewu

### 依赖
* node.js
* npm

### 部署

1. 下载 fewu-cli
```sh
npm install fewu -g
```

2. 自动生成需要的目录和文件。
```sh
fewu --init
```
> 通常这个命令只需要运行一次。你也可以重复运行。是否会破坏数据取决于 Node.js 的内部实现。在 Arch Linux 上的测试结果表明多次运行此命令并无明显影响。

3. [可选] 写一篇博客
```sh
fewu --new
```
> 这个命令会在 `posts` 目录下生成一个 {{Y}}{{m}}{{d}}-new.md 的 Markdown 文档。
> 如果目录下已经有了，则会生成 {{Y}}{{m}}{{d}}-new-{{JUMP_NUMBER}}.md

4. 生成发布版网站
```sh
fewu
# The same as
# fewu --config config.json --release
```
> `fewu` 本身是对 `fewu --config config.json --release` 的简写。

> 你也可以使用 `fewu --devel` 生成开发版网站。发布版与开发版的区别由主题决定。但大多数情况下，发布版会使用 CDN 服务器获取资源文件，而开发版会从网站服务器获取资源文件。如果一个主题的更新速度并不快，我们推荐使用发布版。

> Fewu 在写入网页的时候会首先将已有的网页文件内容与生成的内容比对。如果内容相同，则不会继续写入文件。同时你会在日志输出中看到 SKIPPED 一词。

5. 你的网站已经在 `public` 目录可用了！

## 修改配置
请修改 `config.json`。  
如果你有多个配置文件，可以在运行`fewu`时使用`--config $CONFIG_FILE`手动制定

## 开发主题

请参阅 [主题文档](/_doc/Theme.md)。

> 最快速的方法是从 0xarch 开发的 [Arch](//github.com/0xarch/fewu-theme-arch) 开始，这也是 Fewu 的默认主题。

> See [en-US Document](/_doc/Theme.en-US.md) if you are stupid.

## Code Hack

请 fork 此仓库。

## 为 Fewu 作出贡献

你可以发起 Issue ，或提交 Pull Request 来为 Fewu 作出贡献。我们非常重视你的意见。
> 请耐心。

### 在本地调试

`package.json>scripts` 中包含了对 `fewu` 的模拟。你可以使用 `npm run $SOME_COMMAND` 达到同样的效果，而不必通过软链接到全局目录中。
> `npm run bin` 与直接调用 `fewu` 基本相同。不同的是，你需要通过 `--` 来传递参数。 示例：`npm run bin -- --new`

## 开发者

1. 0xarch(soloev)
2. Anverinmontu(Mento)