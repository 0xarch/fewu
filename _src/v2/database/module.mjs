import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";

class ModuleSection extends AbstractSection {
    /**
     * @type {'none'|'legacy-v1'|'modern'}
     */
    configType = 'none';
    enabled = [];
    options = {};

    constructor(config){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        let confVersion = 'undetected';
        if(config?.module?.enable){
            confVersion = 'legacy-v1';
        }
        if(config['enabled-modules']){
            confVersion = 'modern';
        }

        switch(confVersion){
            case 'legacy-v1':{
                if(!Array.isArray(config.module.enable)){
                    throw new Error(`"module.enable" detected in configuration but it's not an array!`);
                }
                this.enabled.push(...config.module.enable);
                for(let [k,v] of Object.entries(config.module)){
                    if(k === 'enable') continue;
                    this.options[k] = v;
                }
                this.configType = 'legacy-v1';
                break;
            }
            case 'modern': {
                if(!Array.isArray(config['enabled-modules'])){
                    throw new Error(`"enabled-modules" detected in configuration but it's not an array!`);
                }
                this.enabled.push(...config['enabled-modules']);
                Object.assign(this.options,config['module-option']);
                this.configType = 'modern';
                break;
            }
            case 'undetected': {
                console.log(`[Database/Module] No module enabled.`);
                break;
            }
        }

        resolve('module');
    }
}

export default ModuleSection;