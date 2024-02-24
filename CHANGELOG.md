# CHANGELOG

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

    * <since 2.0.1> Sitemap(Xml) support
    * <since 2.0.1, continuing> Page description support
    * <since 2.0.1, experimental, working> RSS support

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
    * Sitemap(xml) support
    * new Builder class
    * new Base class
    * new parser port
    * WebAssembly (rust/c++)
    * Page description support (Function/Variable)
    * RSS support