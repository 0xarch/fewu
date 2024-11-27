import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";
import Argv from "#util/Argv";

class GeneralSection extends AbstractSection {
    /**
     * @type {object}
     */
    config;
    /**
     * @type {string}
     */
    lang;

    constructor(config){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.config = config;
        this.lang = config.general?.lang ?? config.language ?? Argv['--lang'] ?? process.env.lang.replace(/\..*?$/,'').replace(/_/,'-');
        resolve('general');
    }
}

export default GeneralSection;