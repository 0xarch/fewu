import Layout from './class.layout.js';
import GObject from '../core/gobject.js';

class Theme {
    #layouts = [];
    #type;
    #layout_post_using;
    #name;
    #author;
    #desc;
    #copy;
    #option;
    #default;

    constructor(json) {
        if (!json.layout) throw new Error('Could not find layout section in theme configuration file!');
        let layout = json.layout;
        if (!layout.type) throw new Error('Could not find type in theme configuration file');
        this.#type = layout.type;
        if (!layout.post && !layout.post_layout) throw new Error('Could not find layout file post using');
        this.#layout_post_using = layout.post || layout.post_layout;
        if (layout.layouts) {
            for (let i of layout.layouts) {
                this.#layouts.push(new Layout(i));
            }
        }
    }
}