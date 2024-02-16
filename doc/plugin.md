# 插件 PLUGIN

Nexo 自 v2 起处理插件。

## 配置

在主题配置中设置`API.hasPlugin:true`以启用插件。

## 运行时处理

Nexo 对插件开放运行时变量，插件运行时可以修改这些变量。

示例：

```js
let _prev_bid = undefined;
Posts.forEach(item => {
    if(_prev_bid){
        item['prevBID'] = _prev_bid;
        Sorts.BID[_prev_bid]['nextBID'] = item.bid;
    }
    _prev_bid = item.bid;
});
```

**注意** 插件中不允许使用 `fs` ，这被认为是危险操作。除非用户在配置文件中声明 `security .allowFileSystemOperationInPlugin:true`
**注意**插件中不允许修改全局设置，这被认为是危险操作。除非用户在配置文件中声明 `security .allowConfigurationChangeInPlugin:true`



**警告** 由于插件权力较大，请勿运行未经安全验证的插件

## 变量传递

在插件中写入`plugin`方法，Nexo将调用此方法并将返回值以`Plugin`变量的形式传递给生成器.

示例：

```js
function plugin(){
return 'Nexo Plugin Example'
}
```

