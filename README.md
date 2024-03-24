README.md：说明文件。
版权所有 (C) 2020-2024 0xarch(soloev) 
本程序为自由软件：你可以依据自由软件基金会所发布的第三版或更高版本的GNU通用公共许可证重新发布、修改本程序。

虽然基于使用目的而发布本程序，但不负任何担保责任，亦不包含适销性或特定目标之适用性的暗示性担保。详见GNU通用公共许可证。

你应该已经收到一份附随此程序的GNU通用公共许可证副本。否则，请参阅 <http://www.gnu.org/licenses/>。

# Nexo Generator

`Nexo` is an automatic generator for static blog pages.

## Using Nexo

### dependencies
* node.js
* npm

### deployment

1. run `npm i` to download node modules.
```sh
npm i
```
2. run `npm run init` to automatically make required files and directiories.
```sh
npm run init
```
3. run `npm run rel` to generate website.
```sh
npm run rel
```
4. now your site is generated in the `public` directory.