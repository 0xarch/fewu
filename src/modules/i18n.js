import { readFileSync } from 'fs';
import { join } from 'path';
import db from '../core/database.js';

let langfile = {};
let lang_fallback = {};

function set_i18n_file(json){
    langfile = json;
}

function auto_set_i18n_file(){
    try{
        let lang_fb_json = JSON.parse(readFileSync(join(db.dirs.theme.extra,'i18n.default.json')).toString())
        lang_fallback = lang_fb_json;
    } catch(e) {
        console.error('Could not read default(fallback) i18n file in theme directory $THEME/extra/i18n.default.json');
    }
    {
        let lang_file_path = join(db.dirs.theme.extra, 'i18n.' + db.language + '.json');
        try {
            let lang_fl_json = JSON.parse(readFileSync(lang_file_path).toString())
            langfile = lang_fl_json;
        } catch (e) {
            console.error('Could not readi18n file in theme directory $THEME/extra/i18n.$LANG.json');
        }
    }
}

function i18n(key){
    let result;
    if(/[0-9]/.test(key)){
        let __tempor_val = [];
        for(let item of (/[0-9]+/g).exec(key)){
            key = key.replace(item,'{NUMBER}');
            __tempor_val.push(item);
        }
        result= langfile[key]||lang_fallback[key]||key;
        for(let item of __tempor_val){
            result = result.replace('{NUMBER}',item);
        }
    }
    else result = langfile[key]||lang_fallback[key]||key;
    return result;
}

export {
    i18n,
    set_i18n_file,
    auto_set_i18n_file
}