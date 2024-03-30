import ErrorLogger from "#core/error_logger";
import db from "#db";
import { join } from 'path';
import { readFileSync,existsSync } from "fs";
import { warn } from "#core/run";

async function loadPlugin(PROVISION) {
    let theme_plugin_provide;
    if (db.theme.config.plugin == true) {
        // Resolve new plugin (See Plugin Standards v1)
        try {
            const PLUGIN_PATH = join(process.cwd(), db.theme.dirs.extra, 'plugin.mjs');
            const PLUGIN = (await import(PLUGIN_PATH)).default;
            const RETURN_VALUE = PLUGIN.install(PROVISION);

            if (RETURN_VALUE === -1) {
                warn(['The'], ['plugin', 'YELLOW'], ['returns -1, please check it.']);
            }
            theme_plugin_provide = PLUGIN.provide;
        } catch (e) {
            // Fallback old plugin
            try {
                let plugin_text = readFileSync(join(db.theme.dirs.extra, 'plugin.js')).toString();
                let sec_gconf = Object.assign({}, db.site); sec_gconf;
                let site = Object.assign({}, db.site); site;
                let insert_code = 'let Provision = undefined;\n';
                let __plugin_script = 'try{\n' + insert_code + plugin_text + '\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
                theme_plugin_provide = eval(__plugin_script);
            } catch (e_old) {
                ErrorLogger.couldNotLoadPlugin();
                console.error(e);
                console.error(e_old);
                return null;
            }
        }
    } else {
        theme_plugin_provide = {};
    }
    return theme_plugin_provide;
}

async function loadModules(PROVISION) {
    db.modules.enabled.forEach(async (module_name) => {
        let module_path = '#modules/' + module_name + '.js';
        if (existsSync('./_modules/'+module_name+'.mjs')) {
            module_path = process.cwd()+'/_modules/'+module_name+'.mjs';
        };
        try {
            let Module = (await import(module_path)).default;
            const RETURN_VALUE = Module.exec(PROVISION);
            if(RETURN_VALUE === -1){
                warn(['The module'],[module_name,'YELLOW'],['returns -1, please check it.']);
            }
        } catch (e) {
            ErrorLogger.couldNotLoadModule(module_name);
            if(db.builder.mode === 'devel'){
                console.error(e);
            }
        }
    })
}

export {
    loadPlugin,
    loadModules
}