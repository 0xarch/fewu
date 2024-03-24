# Theme/Template

## Overview

Nexo generates websites through themes. The theme is an indispensable part of Nexo. To start writing a theme, you can refer to the Nexo author's theme [Wacal](//github. com/0xarch/nexo theme wacal), which was inspired by the GNOME website.

## Structure

Nexo's theme is a directory. The directory should include at least the following files/directories:

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
`object` module configuration. According to the Nexo module standards v1, modules should read configuration from `Modules.{{moduleName}}`.

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

A plugin is an **executable** JavaScript file. The plugin has complete control over Nexo. Each theme can only have one plugin enabled.
The plugin will be run before generating the page.

The plugin must provide a `plugin()` function. The return value of this function will be provided as an export to the generator. You can access plugin exports in the template through the `plugin` object.