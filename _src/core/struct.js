class BuiltinCorrespond {
    from = '';
    to = '';
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class Cache {
    #cache = {};
    has(name) {
        return this.#cache[name] != undefined;
    }
    /**
     * @deprecated
     */
    stored = (name) => this.has(name);
    get(name) {
        return this.#cache[name];
    }
    set(name, v) {
        this.#cache[name] = v;
    }
    has_or_set(name, fallback) {
        if (this.has(name)) {
            return this.get(name);
        } else {
            this.set(name, fallback);
            return fallback;
        }
    }
}

// macros
function Correspond(from, to) { return new BuiltinCorrespond(from, to) }

export {
    Cache,
    Correspond
}