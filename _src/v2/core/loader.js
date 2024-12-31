import database from "#database";

import { join } from 'path';
import { readFileSync,existsSync } from "fs";
import Console from "#util-ts/Console";

async function loadPlugin(PROVISION) {
    const EXTRA_DIRECTORY = database.data.directory.theme.extraDirectory;
    let theme_plugin_provide;
    if (database.data.theme.config.plugin == true) {
        // Resolve new plugin (See Plugin Standards v1)
        try {
            const PLUGIN_PATH = join(process.cwd(), EXTRA_DIRECTORY, 'plugin.mjs');
            const PLUGIN = (await import(PLUGIN_PATH)).default;
            const RETURN_VALUE = PLUGIN.install(PROVISION);

            if (RETURN_VALUE === -1) {
                Console.warn(`The plugin in ${PLUGIN_PATH} returns -1, please check it.`);
            }
            theme_plugin_provide = PLUGIN.provide;
        } catch (e) {
            // Fallback old plugin
            try {
                const globalSite = database.data.builder.site;
                let plugin_text = readFileSync(join(EXTRA_DIRECTORY, 'plugin.js')).toString();
                let sec_gconf = Object.assign({}, globalSite); sec_gconf;
                let site = Object.assign({}, globalSite); site;
                let insert_code = 'let Provision = undefined;\n';
                let __plugin_script = 'try{\n' + insert_code + plugin_text + '\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
                theme_plugin_provide = eval(__plugin_script);
            } catch (e_old) {
                Console.error(`Error while installing plugin ${e} ${e_old}`);
                return null;
            }
        }
    } else {
        theme_plugin_provide = {};
    }
    return theme_plugin_provide;
}

async function loadModules(PROVISION) {
    database.data.module.enabled.forEach(async (module_name) => {
        let module_path = '#modules/' + module_name + '.js';
        if (existsSync('./_modules/'+module_name+'.mjs')) {
            module_path = process.cwd()+'/_modules/'+module_name+'.mjs';
        };
        try {
            let Module = (await import(module_path)).default;
            const RETURN_VALUE = Module.exec(PROVISION);
            if(RETURN_VALUE === -1){
                Console.warn(`The module ${module_name} returns -1, please check it.`);
            }
        } catch (e) {
            Console.error(`Error while loading module ${module_name} ${e}`);
        }
    })
}

export {
    loadPlugin,
    loadModules
}