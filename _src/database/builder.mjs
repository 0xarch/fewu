import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";
import Argv from "#util/Argv";

class BuilderSection extends AbstractSection {
    /**
     * @type {'devel'|'release'}
     */
    mode;
    site;
    sort;

    constructor(config){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.mode = Argv['--mode']?.[0] == 'devel' ? 'devel' : 'release' ?? Argv['devel'] ? 'devel' : 'release';
        resolve('builder');
    }
}

export default BuilderSection;