import GObject from './gobject.js';
import { Category,Tag } from '../lib/classes.js';

class BuiltinCorrespond {
    from='';
    to='';
    constructor(from,to){
        this.from = from;
        this.to = to;
    }
}
function Correspond(from,to){return new BuiltinCorrespond(from,to)}

class Collection {
    #obj;
    /**
     * 
     * @param {object} obj 
     */
    constructor(obj){
        this.#obj = obj;
    }
    get(key){
        return GObject.getProperty(this.#obj,key);
    }
    has(key){
        return GObject.hasProperty(this.#obj,key);
    }
    append(ext){
        this.#obj = GObject.mix(this.#obj,ext,true);
    }
    asObject(){
        return this.#obj;
    }
    get_all=this.asObject;
}

class Cache {
    #cache={};
    has(name){
        return this.#cache[name] != undefined;
    }
    /**
     * @deprecated
     */
    stored=(name)=>this.has(name);
    get(name){
        return this.#cache[name];
    }
    set(name,v){
        this.#cache[name] = v;
    }
    has_or_set(name,fallback){
        if(this.has(name)){
            return this.get(name);
        } else {
            this.set(name,fallback);
            return fallback;
        }
    }
}

export {
    Collection,
    Correspond,
    Cache,
    Category,
    Tag
}