# 国际化 INTERNATIONALIZATION

Nexo provides `i18n` function in `Provision v2` for internationalization.

## CONFIGURATION

**User** set the language in the global configuration file. Defaults to `en-US`.

## USING I18N
=
Using `i18n` function when writing theme pages.

EXAMPLE:

```pug
.foo
 .bar= i18n('foobar')
```

## I18N FILE

Nexo will read `%Theme%/extra/i18n.%LANG%.json` as basic resolution for i18n function.

### FORMAT

A JSON should be included in the file, which needs include numbers of key-value pair.

Key and value can include space.

### KEYS INCLUDED NUMBERS

`i18n` replaces numbers with `{NUMBER}` to find suitable key.
