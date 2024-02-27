class Cache{
    #cache={};
    stored(name){
        return this.#cache[name] != undefined;
    }
    get(name){
        return this.#cache[name];
    }
    set(name,v){
        this.#cache[name] = v;
    }
    has_or_set(name,fallback){
        if(this.stored(name)){
            return this.get(name);
        } else {
            this.set(name,fallback);
            return fallback;
        }
    }
}

export default Cache;