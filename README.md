README.md：说明文件。  
README.zh-CN.md：说明文件。

版权所有 (C) 2020-2024 0xarch(soloev) 
本程序为自由软件：你可以依据自由软件基金会所发布的第三版或更高版本的GNU通用公共许可证重新发布、修改本程序。

虽然基于使用目的而发布本程序，但不负任何担保责任，亦不包含适销性或特定目标之适用性的暗示性担保。详见GNU通用公共许可证。

你应该已经收到一份附随此程序的GNU通用公共许可证副本。否则，请参阅 <http://www.gnu.org/licenses/>。

# Nexo

`Nexo` 是一个自动化静态博客生成器。
> 注意：可能很快你就可以在 npm 上看见这个东西了！

## 使用 Nexo

### 依赖
* node.js
* npm

### 部署

1. 克隆本仓库。

2. 下载依赖模块。
```sh
npm i
```

3. 自动生成需要的目录和文件。
```sh
npm run init
```
> 通常这个命令只需要运行一次。你也可以重复运行。是否会破坏数据取决于 Node.js 的内部实现。在 Arch Linux 上的测试结果表明多次运行此命令并无明显影响。

4. [可选] 写一篇博客
```sh
npm run new
```
> 这个命令会在 `posts` 目录下生成一个 {{Y}}{{m}}{{d}}-new.md 的 Markdown 文档。

5. 生成发布版网站
```sh
npm run rel
```
> 你也可以使用 `npm run dev` 生成开发版网站。发布版与开发版的区别由主题决定。但大多数情况下，发布版会使用 CDN 服务器为获取资源文件，而开发版会从网站服务器获取资源文件。如果一个主题的更新速度并不快，我们推荐使用发布版。

> Nexo 在写入网页的时候会首先将已有的网页文件内容与生成的内容比对。如果内容相同，则不会继续写入文件。同时你会在日志输出中看到 SKIPPED 一词。

6. 你的网站已经在 `public` 目录可用了！
> 我们为 git 设置默认忽略 `public` 目录，你可以直接在 `public` 中初始化仓库！

## 开发主题

请参阅 [主题文档](/_doc/Theme.zh-CN.md)。

> 最快速的方法是从 0xarch 开发的 [Arch](//github.com/0xarch/nexo-theme-arch) 开始，这也是 Nexo 的默认主题。

> See [en-US Document](/_doc/Theme.md) if you are stupid.

## Code Hack

请 fork 此仓库。

## 为 Nexo 作出贡献

你可以发起 Issue ，或提交 Pull Request 来为 Nexo 作出贡献。我们非常重视你的意见。
> 作者重度抑郁，而且在合作开发这一块没什么经验，请尽量耐心。

## 开发者

1. 0xarch(soloev)
2. Anverinmontu(Mento)