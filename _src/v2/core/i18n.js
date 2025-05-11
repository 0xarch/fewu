import database from '#database';
import Console from '#util/Console';
import I18n from '#util/I18n';

import { readFileSync } from 'fs';
import { join } from 'path';

const i18n = new I18n();

globalThis.DATABASE_INIT_DONE.then(()=>{
    const EXTRA_DIRECTORY = database.data.directory.theme.extraDirectory;
    let langProfile = {};
    try {
        let lang_fb_json = JSON.parse(readFileSync(join(EXTRA_DIRECTORY, 'i18n.default.json')).toString())
        Object.assign(langProfile,lang_fb_json);
    } catch (e) {
        Console.error(`Could not read default i18n profile.`);
    }
    const LANG_FILE_PATH = join(EXTRA_DIRECTORY, `i18n.${database.data.general.lang}.json`);
    try {
        let lang_fl_json = JSON.parse(readFileSync(LANG_FILE_PATH).toString())
        Object.assign(langProfile,lang_fl_json);
    } catch (e) {
        Console.error(`Could not read default i18n profile. ${LANG_FILE_PATH}`);
    }
    i18n.setProfile(langProfile);
})

export default i18n;