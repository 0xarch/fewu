# CHANGELOG

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

* use new `Collection` for all functions and remove old codes
* move old builder to new place

### Prepared

* constants for short code (unused)
* config template for init and auto using (unused)

## 2.0.3-3 - 2024-02-26

### New

* **EXPERIMENTAL** short path (exShortPath)

### Planned

* better variable requiring

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

* Error during parsing EJS template <ERROR "Could not find the include file">

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
* Sitemap(xml) support [2.0.2]
* new Builder class
* new Base class
* new parser port
* WebAssembly (rust/c++)
* Page description support (Function/Variable) [2.0.2]
* RSS support [2.0.2]