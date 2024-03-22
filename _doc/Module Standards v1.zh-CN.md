# Nexo 模块标准 v1

## 组成

Nexo 模块需要遵循 ES6(及更新) 标准，至少提供一个默认导出。

模块的默认导出必须为一个JavaScript 对象(`Object`)，并且该对象必须包含以下属性：

### exec

此属性的类型为 `Function` ，作为模块的主执行函数，Nexo将在生成时调用此函数。
此函数的参数数量应为 `0`，对于获取数据，请使用 `database` 。

## 工作

### 提示

Nexo 模块对于 Nexo 的任何部位**都具有操作权**，但我们并不希望你**过度干扰** Nexo 的运作。您应该只从 Nexo 的**数据库**中读取属性。

> 模块是异步调用的，所以你不应该书写任何干扰其他模块的代码。

### 读取配置

Nexo 推荐的模块配置存放位置在 `db.settings[modules]` 小节中，每个模块的配置在不额外说明的情况下，应位于用户配置的 `db.settings[modules.<moduleName>]` 小节中。 Nexo 默认使用内置的 `Collection` 类存储配置文件，所以你应该通过 `db.settings.get('modules.<moduleName>')` 来获得一个包含配置的 `object`。

### 调用

我们推荐一个标准模块只调用 `#db` `#core/constants` 和 node.js 的内置库，但你仍然可以调用其他的库，我们并不对此作出限制。

## 示例

以下是一个简单的 Nexo 模块，代码通过调用数据库，在生成目录下生成一个包含 Nexo 版本号的 `nversion` 文件。

```js
import db from '#db';
import { writeFile } from 'fs';
import { join } from 'path';

function write_version_to_public(){
    let version = db.constants.NEXO_VERSION;
    writeFile(join(db.dirs.public, 'nversion'), version, (e)=>{if(e)throw e});
}

const Module = {
    exec: write_version_to_public,
}

export default Module;
```