# Fewu 插件标准 v1

## 组成

Fewu 插件需要遵循 ES6(及更新) 标准，至少提供一个默认导出。

插件的默认导出必须为一个 JavaScript 对象(`Object`)，并且该对象必须包含以下属性：

### install

插件的主执行函数，Fewu将在生成时调用此函数。

#### typedef
```
Function(PROVISION:any) -> any {
    ... private field ...
}
```

##### PROVISION
```
{
    db: Database,
    site: Database.site,
    proc: Database.proc,
    CONSTANTS: Database.constants,
    fewu: FewuTools,
    GObject
}
```

#### 返回

多数情况下 Fewu 并不关心此函数的返回值。 但当函数返回了任何使 `RETURN_VALUE === -1` 为真的值时，Fewu 会对用户发出警告：插件运行中出现错误。

### provide

此属性的类型为 `any` ， Fewu 将此属性作为变量传递给生成器，生成器内的变量名为`plugin`。
> 也提供`Plugin`，`Plguin`属性已经弃用，将在未来移除，两者等效。

#### 出现错误

Fewu 的插件运行在一个 `try-catch` 代码块中。 当插件运行出现错误， Fewu 会终止程序运行并打印错误。

## 工作

### 读取

##### Collection [推荐]

Fewu 推荐的插件配置存放位置在 `db.settings[modules]` 小节中，每个插件的配置在不额外说明的情况下，应位于用户配置的 `db.settings[modules.<moduleName>]` 小节中。 Fewu 默认使用内置的 `Collection` 类存储配置文件，所以你应该通过 `db.settings.get('modules.<moduleName>')` 来获得一个包含配置的 `object`。
> `Collection.asObject()` 方法可以将存储的数据导出为 `object`

#### 直接使用 object

`db.config` 是与 `db.settings.asObject()` 等效的 `object` 对象。默认情况下两者存放的数据完全相同。
直接调用 `object` 可能会报错并导致 Fewu 停止运行。因此使用 `db.config` 获取数据时需要做好错误处理。

### 调用

我们推荐一个标准插件只调用 `#db` `#core/constants` 和 node.js 的内置库，但你仍然可以调用其他的库，我们并不对此作出限制。
> 我们默认在 node.js 的 `global` 全局对象中挂载了 `database`，因此如果你不需要 IDE 自动补全等，可以直接使用 `database` 而不需要从 `#db` 导入。

## 示例

以下是一个简单的 Fewu 插件，代码通过调用数据库，在生成目录下生成一个包含 Fewu 版本号的 `nversion` 文件，并在导出中提供一个键值对 `foo: 'bar'`。

```js
import { writeFile } from 'fs';
import { join } from 'path';

function write_version_to_public(PROVISION){
    const {db} = PROVISION;
    let version = db.constants.FEWU_RELEASE_VERSION;
    writeFile(join(db.dirs.public, 'nversion'), version, (e)=>{if(e)throw e});
}

let provide = {
    foo: 'bar'
}

const PLUGIN = {
    install: write_version_to_public,
    provide,
}

export default PLUGIN;
```