# CHANGELOG

**BETA NOW**

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

### In Progress

* [x] `core/database` for storing configs,etc, in running [ 2.2.2]
* [ ] `lib/class.theme` for storing theme configuration [Marked as deprecated]
* [ ] `modules/init` for greenhand initialization

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

### Planned

* [x] better variable requiring [database 2.2.0]

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

### In Progress
* [x] Sitemap(xml) support [ 2.0.2]
* [ ] new Builder class
* [x] new Base class [GObject 2.1.0]
* [ ] new parser port []
* [ ] WebAssembly (rust/c++)
* [x] Page description support (Function/Variable) [ 2.0.2]
* [x] RSS support [ 2.0.2]