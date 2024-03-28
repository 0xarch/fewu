# CHANGELOG

**BETA NOW**

## s1.0.X+11(n2.3.0-0+325) [EDITING] - 2024-03-24

### Critical Changes
* `database` section `theme` has now changed to be an object with `config`(before `db.theme`) `dirs`(before `db.dirs.theme`) `name` `variables`(before `db.theme[default]`)
* Theme's configuration file has now changed a lot. See documentation.
* Nexo source code is now moved to _src

### Update docs
* [u] BID
* [u] Theme

### Changed
* Move all built-in assets into `_assets` directory

### New
* Support for quickly start a post, run `npm run new` in terminal you'll get a new .md in the `posts` directory.
* Support for terminal **IMPORTANT**, you can run `npm link` then use `nexo-cli` in your terminal for all functions! *NOTE THAT* you can also use `npm run` and so on when you cloned `nexo`

### Fixed
* `gopt` got wrong arguments

## b1.0.4(n2.2.6-0) [QUICK PASSED] - 2024-03-22

### Changed
* `Map` is going to be used as the default data type of `site.categories`, `site.tags` and `ID`, while now Nexo provides an `IDMap` export that is experimental
* `Post` now has a new property `parsed` for storing parsed content/foreword

### New
* `html-minifier` is used to compress html file
* a bridge file is used for import structures and class

### Update docs
* BID
* Theme

## b1.0.3-3(n2.2.5-4) - 2024-03-20

### Changed
* `GObject.mix` is now recursive.
* FULL support of `GString`
* alias class from `descriptive_class` to `struct`
* moved `src/modules` directory to `_modules`

### New
* you can now customize the foreword when a post has no foreword.
* node imports alias (`#core` `#db` `#struct`)
* docs for **Module Standards v1**

### Announced
* The first stable version will be s1.0.0, as the beta version b1.1.0, and nexo version n2.3.0

## b1.0.3-2(n2.2.5-2) - 2024-03-19

### Changed
* config.json is now generated automatically by init module
* rerecongized codes
* `i18n` is merged into **Core**
* `init` is merged into **Core**
* `extra_files` separated as a module named `extra_files`
* some part codes in app.js is divided as part.js

### New
* `GString` class (struct) (Experimental,WIP)
* advanced module support is now experimental
* **Module Standards v1**

### Fixed
* wrong order in `site.categories` and `site.tags`
* `init` overrides files

### Removed
* `lib/mod.js` (moved to `core/run`)
* `lib/class.post.js` (`Post` moved to `core/descriptive_class`)

## b1.0.3-1(n2.2.5-1) - 2024-03-12

### Changed
* `CODE[0]` is now `FED`
* {`Tag`,`Category`}.included_article is now renamed to included

### New
* structure tree, better organizing
* `init` module completed (call using `npm run init`)
* `text_process.js` for processing text *haha
* `descriptive_class.js` for descriptive class like `Category` `Tag` `License` `Datz`
* i18n fallback file support (`i18n.default.json`)

### Removed
* `classes.js` (GARBAGE)
* `file_class.js` (GARBAGE)

## b1.0.3(n2.2.4-3) - 2024-03-12

### Changed

* pre sorted for posts
* flatter builtin icon
* `Datz.compareWith` now can be used as a `compareFn` (strongly not recommend to use `Datz.compareWith` outside `Array.sort` unless you know what you are exactly doing!)
* BID now starts with `1`
* `CONSTANTS` now can be read as constant.

### Fixed

* Unexpected error while scanning objects without `option` attribute in layout section.

## b1.0.2(n2.2.4-2) - 2024-03-12

The same as 2.2.4-2 , this is a bump tag where version-rel and version-nexo separated.

## 2.2.4-2 - 2024-03-08

### Removed

* old codes

### New

* `builder` section in database
* `NULL_OBJECT` function to create an object that it's prototype = null

## 2.2.4-1 - 2024-03-08

### Fixed

* i18n number matching bug

## 2.2.4 - 2024-03-08

### New
* Automatically adds H1 tag in post

## 2.2.3-2 - 2024-03-04

### New

* build mode for theme to better organize (release/devel)

### Fixed

* whitespace in (parsed) post title
* `undefined` and too much whitespace in searchStrings.json

## 2.2.3-1 - 2024-03-04

### Changed

* encoded string for path now (not id as before, * might change sometime)
* `nexo.logo` back to function, and removes multiple stylesheets
* `Post.paths.[website/local]` for static call
* operation only update theme will not read post now

### Preview

* `code` and `node` section in `core/constants`

## 2.2.3 [SEARCH-UPDATE] - 2024-03-02

### Changed

* Removed `by` section in `searchStrings.json` to increase search speed.

## 2.2.2 [DEVELOPER-UPDATE] [CRITICAL-UPDATE] - 2024-03-01

### New

* basic database for storing
* widely using of `GObject`

### REMOVED **

* **CRITICAL** OLD API (v1) SUPPORT

## 2.2.0 [BUMP] - 2024-03-01

### New

* `core/run` (gopt support)
* `CONSTANTS` now merged in Provision
* `core/reader` (rename `lib/post`)
* new design for default `Arch` theme

### Changed

* rename `SITEMAP` to lower case `sitemap`
* move `PostSortingFunction` to class `Post` as a static method.

### Removed

* `lib/post` (renamed as `core/reader`)
* `modules/classes` (deprecated GARBAGE code)
* `modules/filesys` (deprecated GARBAGE code)
* `modules/hug` (deprecated GARBAGE code, replaced by `core/run`)
* `modules/-r-/v2` (deprecated, unimportant, unused feature)

## 2.1.2 - 2024-02-27

### New

* `used_tags` and `used_categories` in `site` for tag/category name as array

## 2.1.1-1 - 2024-02-27

### Fixed

* wrong cycling times

## 2.1.1 - 2024-02-27

### Fixed

* '~' bug
* wrong tags

### New

* last modified date support

## 2.1.0 - 2024-02-27

### Removed

* **CRITICAL** GARBAGE CODE build pages
* `Configuration` class (use `Collection` instead)

### New

* `Collection` class
* `Layout` class
* `Cache` class (replace `Cachable`)
* `Correspond` (struct) class
* `GObject` (unused, for developing)

### Changed

* short path is now default
* renamed functions in sitemap module
* get_property now supports array as the second argument

### Fixed

* update rss module for new feature
* update sitemap module for new feature

### Planned

* [x] use new `Collection` for all functions and remove old codes [ 2.2.3]
* [x] move old builder to new place [ 2.2.3]

### Prepared

* constants for short code (unused)
* config template for init and auto using (unused)

## 2.0.3-3 - 2024-02-26

### New

* **EXPERIMENTAL** short path (exShortPath)

## 2.0.3-2 - 2024-02-26

### New

* `property` property for Post class to store post info that not as default (e.g. highlight)

### Fixed

* wrong sort order

## 2.0.3-1 - 2024-02-26

### New

* `path` function for Post class (`websitePath`=>`path('website')`,`publicFilePath`=>`path('local')`)

### Changed

* app: better performance for API collector
* sitemap: fixed priority

### Removed

* app: garbage API(from v1) in v2

## 2.0.3 - 2024-02-25

### Changed

* CRITICAL foreword is now a separate part as description [Wsince 2.0.1]
* CRITICAL-THEME use copy.@posts instead of rawPosts.copy{,to}, see the default Arch theme.

### New

* Foreword length check (25 ~ 200)
* `Cachable` class for storing results.

### Other

* Cleared CHANGLOG.md

## 2.0.2-4 - 2024-02-25

### New

* new `i18n` function (compatible with older for now)
* new function to get parsed content(foreword,...) of post(compatible with older for now)

## 2.0.2-3 - 2024-02-24

### Changed

* `v=>v!=''` closure as `notFake`

### New

* `warn` function
* basic post keyword support

## 2.0.2-2 - 2024-02-24

### Changed

* update README.md

## 2.0.2-1 - 2024-02-24

### Changed

* use encodeURI for sitemap generation(txt, xml)

### Fixed

* white background of nexo logo
* 9001 error

### Planned

* remove deprecated codes
* cleaner renderer
* API v3

## 2.0.2 - 2024-02-16

### Removed

* sortArticle in Provision V2

### Changed

* rename sources to resources
* removed useless console.log

### Features

* [since 2.0.1] Sitemap(Xml) support
* [since 2.0.1, continuing] Page description support
* [since 2.0.1, experimental, working] RSS support

### Known bugs

* Error during parsing EJS template ERROR "Could not find the include file" [Marked as deprecated]

## 2.0.1 - 2024-02-16

### Features
* Sitemap(txt) support
* [Theme] PUG support
* Word counting for posts
* Category & Tag

### Fixed Bugs
* No Nexo Bug [Since 0.0.-1]

### Deprecated Functions
* Hug (With bugs, and no actual meaning) use LibMod now.
* Hail(Low performance) use native fs now.
