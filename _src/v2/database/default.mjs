import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";

class DefaultSection extends AbstractSection {
    /**
     * @type {string}
     */
    introduction;
    /**
     * @type {string}
     */
    categories;

    constructor(config){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.introduction = config.default?.introduction ?? config.default?.foreword ?? config.fallback?.introduction ?? config.fallback?.foreword ?? '';
        this.categories = config.default?.categories ?? config.fallback?.categories ?? 'uncategorized';
        resolve('default');
    }
}

export default DefaultSection;