# Theme/Template

## Overview

Fewu generates websites through themes. The theme is an indispensable part of Fewu. To start writing a theme, you can refer to the Fewu author's theme [Wacal](//github. com/0xarch/nexo theme wacal), which was inspired by the GNOME website.

## Structure

Fewu's theme is a directory. The directory should include at least the following files/directories:

*[Directory] Layouts web page template
*[Directory] Files web resources, such as CSS and JS
*[Directory] Extra theme resources, such as i18n files and plugin scripts
*[File] Theme. json Main Theme Configuration Files
*[File] Configuration file for variables. JSON theme variable

## theme.json

### operations
`ThemeOperation[]` operations.

### plugin
`boolean` Whether to enable plugins. The default is `false`.

### Modules.*
`object` module configuration. According to the Fewu module standards v1, modules should read configuration from `Modules.{{moduleName}}`.

### parser
`string` The name of the module parser used.

### template
`string<PathLike>` Search for the template file name used to generate blog posts in the `layouts` directory.

### layouts
`ThemeLayout[]` Page generation configuration.

### name [optional]
`string` Theme name, has no actual effect.
### author [optional]
`string` Author, has no actual effect.
### thanks [optional]
`string` Thanks, has no actual effect.
### description [optional]
`string` Theme description, has no actual effect.
### lib [optional]
`string[]` Theme dependent library, has no actual effect.

## variables.json
Include a JSON object as the default value for theme variables.

## extra

Store i18n files and plugins.

### i18n file

A JSON file. Naming: `i18n.{{LANG}}.json`

Process default values (fallback) file for i18n: `i18n.default.json`

### plugins

A plugin is an **executable** JavaScript file. The plugin has complete control over Fewu. Each theme can only have one plugin enabled.
The plugin will be run before generating the page.

The plugin must provide a `plugin()` function. The return value of this function will be provided as an export to the generator. You can access plugin exports in the template through the `plugin` object.

## files

Resource directory.

Fewu will **completely copy** this directory to the directory with the same name on the website during processing, that is, `{{PUBLIC-DIR}}/files`.

## layouts

Template directory.

This directory should only store template files. Fewu reads template files from each section of the layouts section.

## *ThemeOperation

`*ThemeOperation` identifies the operation.

Each `*ThemeOperation` should at least contain one`do` key. Fewu will perform corresponding operations based on the value corresponding to this key.

## *ThemeLayout

`*ThemeLayout` identifies the page.

`*ThemeLayout` structure：

```jsonc
{
    "name": "Identification, has no actual meaning",
    "from": "A file located in the layouts directory",
    "to": "A directory relative to PUBLIC_DIR",
    "varias": false, // Whether to enable the Varias Builder Module.Default to false
    "cycling": false, // Whether to enable Cycling Builder Module.  Default to false
    "option": { // This section identifies the configuration of the Builder Module
        "varias": {
            // Varias configuration
        },
        "cycling": {
            // Cycling configuration
        }
    }
}
```