import NewPromise from "#util/NewPromise";
import Argv from "#util/Argv";
import { DataSection } from "./abstract.mjs";

class GeneralSection extends DataSection {
    config: any;
    lang: string;

    constructor(config: any) {
        let { promise, resolve } = NewPromise.withResolvers();
        super({
            mutable: false
        }, promise);
        this.config = config;
        this.lang = (config.general?.lang ?? config.language ?? Argv['--lang'] ?? process.env.lang).replace(/\..*?$/, '').replace(/_/, '-');
        resolve('general');
    }
}

export default GeneralSection;