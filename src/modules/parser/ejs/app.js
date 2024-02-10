/**
 * @lib node/ejs
 */

import { render } from 'ejs';

export function parse(ejs_template, ejs_extra_json) {
    let content = render(ejs_template, ejs_extra_json);
    return content;
}