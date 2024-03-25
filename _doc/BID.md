# Nexo BID system

## What is a BID system

The BID system is a tool used by Nexo to mark blog posts, **dynamically generated** every time Nexo runs. Nexo uses BID to mark every blog post.

## Using

Unless otherwise specified, the sorting group exported by Nexo's `sort` contains the BID of the blog post. Nexo's `ID` export is a `Map` that provides a mapping relationship between BID and blog posts, so when using it, detailed information about the blog post needs to be obtained from the `ID`.

The following is an example of obtaining information for a blog post with a BID of 1 from the `ID` and outputting it from the command line.

```js
function read_bid_1_and_log(){
    const post = ID[1];

    if (!post) return;

    let {title,date,lastModifiedDate,category,tags} = post;

    console.log(`Title: ${title}\nPublish date: ${date}\nLast modified date: ${lastModifiedDate}\nCategory(s): ${category.join()}\nTag(s): ${tags.join()}`);
}
read_bid_1_and_log();
```