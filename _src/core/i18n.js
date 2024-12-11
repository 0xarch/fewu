import database from '#database';
import Console from '#util/Console';

import { readFileSync } from 'fs';
import { join } from 'path';

let langfile = {};
let lang_fallback = {};

function setFile(json) {
    langfile = json;
}

function autoSetFile() {
    const EXTRA_DIRECTORY = database.data.directory.theme.extraDirectory;
    try {
        let lang_fb_json = JSON.parse(readFileSync(join(EXTRA_DIRECTORY, 'i18n.default.json')).toString())
        lang_fallback = lang_fb_json;
    } catch (e) {
        Console.error(`Could not read default i18n profile.`);
    }
    {
        const LANG_FILE_PATH = join(EXTRA_DIRECTORY, `i18n.${database.data.general.lang}.json`);
        try {
            let lang_fl_json = JSON.parse(readFileSync(LANG_FILE_PATH).toString())
            langfile = lang_fl_json;
        } catch (e) {
            Console.error(`Could not read default i18n profile. ${LANG_FILE_PATH}`);
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