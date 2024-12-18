import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";
import Argv from "#util/Argv";
import AbstractExposedApi from "#class/AbstractExposedApi";

class BuilderSection extends AbstractSection {
    /**
     * @type {'devel'|'release'}
     */
    mode;
    site;
    sort;

    /**
     * @type {AbstractExposedApi}
     */
    exposedApi;

    constructor(){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.mode = Argv['--mode']?.[0] == 'devel' ? 'devel' : 'release' ?? Argv['devel'] ? 'devel' : 'release';
        this.exposedApi = new AbstractExposedApi();
        resolve('builder');
    }
}

export default BuilderSection;