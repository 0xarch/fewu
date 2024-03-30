import { readFileSync } from 'fs';
import { join } from 'path';
import db from '#db';
import ErrorLogger from '#core/error_logger';

let langfile = {};
let lang_fallback = {};

function setFile(json) {
    langfile = json;
}

function autoSetFile() {
    try {
        let lang_fb_json = JSON.parse(readFileSync(join(db.theme.dirs.extra, 'i18n.default.json')).toString())
        lang_fallback = lang_fb_json;
    } catch (e) {
        ErrorLogger.couldNotLoadI18nDefault();
    }
    {
        let lang_file_path = join(db.theme.dirs.extra, 'i18n.' + db.language + '.json');
        try {
            let lang_fl_json = JSON.parse(readFileSync(lang_file_path).toString())
            langfile = lang_fl_json;
        } catch (e) {
            ErrorLogger.couldNotLoadI18nFile();
        }
    }
}

function i18n(key) {
    let result;
    if (/[0-9]/.test(key)) {
        let __tempor_val = [];
        for (let item of (/[0-9]+/g).exec(key)) {
            key = key.replace(item, '{NUMBER}');
            __tempor_val.push(item);
        }
        result = langfile[key] ?? lang_fallback[key] ?? key;
        for (let item of __tempor_val) {
            result = result.replace('{NUMBER}', item);
        }
    }
    else result = langfile[key] ?? lang_fallback[key] ?? key;
    return result;
}

export default {
    i18n,
    setFile,
    autoSetFile
}