/**
 * @lib node/ejs
 */

const EJS = require('ejs');

exports.parse = function(ejs_template, ejs_extra_json) {
    let content = EJS.render(ejs_template, ejs_extra_json);
    return content;
}