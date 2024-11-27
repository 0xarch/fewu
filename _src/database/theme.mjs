import { AbstractSection } from "./abstract.mjs";
import Argv from "#util/Argv";
import NewPromise from "#util/NewPromise";
import { existsSync, read } from "fs";
import { readFile } from "fs/promises";

class ThemeSection extends AbstractSection {
    /**
     * @type {object}
     */
    config;
    /**
     * @type {object}
     */
    variables;
    /**
     * @type {string}
     */
    name;

    constructor(config){
        let {promise,resolve,reject} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.name = Argv['--theme'] ??  Argv['-t'] ?? config['theme-name'] ?? config.theme?.name ?? 'Wacal';
        let configFilePath = `_themes/${this.name}/theme.json`;
        let varFilePath = `_themes/${this.name}/variables.json`;
        if(!existsSync(configFilePath)){
            reject('theme.failed.no-such-theme');
        }
        readFile(configFilePath).then((buffer)=>{
            let configString = buffer.toString();
            let config = {};
            try {
                config = JSON.parse(configString);
            } catch(e){
                reject('theme.failed.error-parsing-config');
            }
            this.config = config;
            if(existsSync(varFilePath)){
                readFile(varFilePath).then((buffer)=>{
                    let varString = buffer.toString();
                    let vars = {};
                    try {
                        vars = JSON.parse(varString);
                    } catch(e){
                        reject('theme.failed.error-parsing-var');
                    }
                    this.variables = vars;
                    resolve('theme');
                });
            } else {
                resolve('theme.no-var-file');
            }
        });
    }
}

export default ThemeSection;