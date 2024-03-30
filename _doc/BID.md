# Nexo BID 系统

## 什么是 BID 系统

BID 系统是 Nexo 用来标记博文的工具，在每次 Nexo 运行时**动态**生成。 Nexo 通过 BID 来标记每一篇博文。

## 使用

在没有额外说明的情况下， Nexo 的 `sort` 导出下的排序组所包含的都是博文的 BID。 Nexo 的 `ID` 导出是一个 `Map`，提供了 BID 和博文的映射关系，因此使用时需要从 `ID` 获取博文的详细信息。

以下是一个从 `ID` 中获取 BID 为 1 的博文的信息并从命令行输出的示例。

```js
function read_bid_1_and_log(){
    const post = ID[1];

    if (!post) return;

    let {title,date,lastModifiedDate,category,tags} = post;

    console.log(`Title: ${title}\nPublish date: ${date}\nLast modified date: ${lastModifiedDate}\nCategory(s): ${category.join()}\nTag(s): ${tags.join()}`);
}
read_bid_1_and_log();
```