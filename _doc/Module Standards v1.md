# Fewu 模块标准 v1

## 组成

Fewu 模块需要遵循 ES6(及更新) 标准，至少提供一个默认导出。

模块的默认导出必须为一个 JavaScript 对象(`Object`)，并且该对象必须包含以下属性：

### exec

模块的主执行函数，Fewu将在生成时调用此函数。

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

多数情况下 Fewu 并不关心此函数的返回值。 但当函数返回了任何使 `RETURN_VALUE === -1` 为真的值时，Fewu 会对用户发出警告：模块运行中出现错误。

#### 出现错误

Fewu 的模块运行在一个 `try-catch` 代码块中。 Fewu 不会关心抛出错误的类型。当模块抛出了一个错误时，若 Fewu 运行于 `release` 模式中，则仅会显示错误模块名，若 Fewu 运行于 `devel` 模式中，则会将错误打印至`console.error`。

## 工作

### 提示

模块是异步调用的，所以你不应该书写任何干扰其他模块的代码。

### 读取配置

##### Collection [推荐]

Fewu 推荐的模块配置存放位置在 `db.settings[modules]` 小节中，每个模块的配置在不额外说明的情况下，应位于用户配置的 `db.settings[modules.<moduleName>]` 小节中。 Fewu 默认使用内置的 `Collection` 类存储配置文件，所以你应该通过 `db.settings.get('modules.<moduleName>')` 来获得一个包含配置的 `object`。
> `Collection.asObject()` 方法可以将存储的数据导出为 `object`

#### 直接使用 object

`db.config` 是与 `db.settings.asObject()` 等效的 `object` 对象。默认情况下两者存放的数据完全相同。
直接调用 `object` 可能会报错并导致 Fewu 停止运行。因此使用 `db.config` 获取数据时需要做好错误处理。

### 调用

我们推荐一个标准模块只调用 node.js 的内置库，但你仍然可以调用其他的库，我们并不对此作出限制。
> 我们默认在 node.js 的 `global` 全局对象中挂载了 `database`，因此如果你不需要 IDE 自动补全等，可以直接使用 `database` 而不需要从 `#db` 导入。

## 示例

以下是一个简单的 Fewu 模块，代码通过调用数据库，在生成目录下生成一个包含 Fewu 版本号的 `nversion` 文件。

```js
import { writeFile } from 'fs';
import { join } from 'path';

function write_version_to_public(PROVISION){
    const {db} = PROVISION;
    let version = db.constants.FEWU_RELEASE_VERSION;
    writeFile(join(db.dirs.public, 'nversion'), version, (e)=>{if(e)throw e});
}

const Module = {
    exec: write_version_to_public,
}

export default Module;
```