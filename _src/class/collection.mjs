import GObject from "#core/gobject";

class Collection {
    #obj
    /**
     * 
     * @param {object} obj 
     */
    constructor(obj) {
        this.#obj = obj
    }
    get(key) {
        return GObject.getProperty(this.#obj, key)
    }
    has(key) {
        return GObject.hasProperty(this.#obj, key)
    }
    append(ext) {
        this.#obj = GObject.mix(this.#obj, ext, true)
    }
    asObject() {
        return this.#obj;
    }
}

export default Collection;