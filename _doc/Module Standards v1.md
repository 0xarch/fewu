# Nexo Module Standard v1

## Composition
The Nexo module needs to comply with the ES6 (and newer) standard and provide at least one default export.
The default export of a module must be a JavaScript object ('Object '), which must contain the following properties:

### Exec
The type of this property must be `Function`, and as the main executing function of the module, Nexo will call this function during generation.
The number of parameters for this function should be `0`. For obtaining data, please use `database`.

## Work

### Tips

The Nexo module has the right to operate any part of Nexo, but we **do not** want you to excessively interfere with Nexo's operation. You should only read properties from Nexo's **database**.

> Modules are called asynchronously, so you should not write any code that interferes with other modules.

### Reading Configuration

Nexo recommends storing module configurations in the `db.settings[modules]` section. Unless otherwise specified, the configuration of each module should be located in the `db.settings[modules.<moduleName>]` section of the user configuration. Nexo defaults to using the built-in `Collection` class to store configuration files, so you should get an `object` containing the configuration from calling `db.settings.get('modules.<moduleName>')`.

### Call

We recommend a standard module that only calls the `#db` `#core/constants` and built-in libraries of node.js, but you can still call other libraries without any restrictions.
> We mounted the `database` on the `global` global object. If you do not need auto completion, it is no need to use it from import `#db`.

## Example

The following is a simple Nexo module, where the code calls the database and generates an `nversion` file containing the Nexo version number in the generated directory.

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