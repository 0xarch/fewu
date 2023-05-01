开发一个拓展组件(Widget)：

基本格式：(.ejs)

```ejs
<div.widget.name>
    <div.header> ...Something... </div>
    <div.content> ... Something... </div>
</div>
```
其中：

```<div.widget.name>```是Widget的头标识，name为拓展名字

```<div.header>```为Widget的标头，可选，也可写```<a.header href="/foo/bar">```，代表该标头链接到某地址

```<div.content>```为Widget的内容标识，必需，内部为Widget内容

实例：公告栏(./announcement.ejs)

```ejs
<div.widget.announcement>
    <div.header>
        <i.fas.fa-bullhorn></i>
        <span>公告</span>
    </div>
    <div.content>
        <span><@info.features.announcementText></span>
    </div>
</div>
```