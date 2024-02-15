# Nexo Plugin

Nexo allows you to use additional plugins to achieve more local functionality.

## Theme side

Set API. hasPlugin for the theme to inform Nexo to run plugins.

Nexo will use% Theme%/extra/plugin.js as the plugin location.

Nexo will use the `eval` function to run this file and pass the result of the plugin method as the Plugin variable name to the generator.
Plugins can modify any Nexo runtime variable.

The return value of plugin can be any valid JavaScript object.

**EXAMPLE**
This is a plugin that adds adjacent article IDs to each article, which has been implemented by Nexo's experimental Article class in v2.01.

```js
let _prev_bid = undefined;
Posts.forEach(item => {
    if(_prev_bid){
        item['prevBID'] = _prev_bid;
        Sorts.BID[_prev_bid]['nextBID'] = item.bid;
    }
    _prev_bid = item.bid;
});
function plugin(){
    return 'Nexo Plugin Example'
}
```

**Warning about this**: Do not easily use unverified code

## User side

Still in the proposal phase, if you want to run certain code as a user, please manually modify the plugin file for the theme.

The user side plugin function is expected to be implemented in v2.03.