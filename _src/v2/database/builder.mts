import { DataSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";
import Argv from "#util/Argv";
import AbstractExposedApi from "#class/AbstractExposedApi";

class BuilderSection extends DataSection {
    mode: 'devel' | 'release';
    site?: any;
    sort?: any;

    exposedApi: AbstractExposedApi;

    plugin?: any;

    constructor() {
        let { promise, resolve } = NewPromise.withResolvers();
        super({
            mutable: false
        }, promise);
        this.mode = Argv['--mode']?.[0] == 'devel' || Argv['-D'] ? 'devel' : 'release';
        this.exposedApi = new AbstractExposedApi();
        resolve('builder');
    }
}

export default BuilderSection;