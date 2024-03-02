import GObject from './gobject.js';
import { Category,Tag } from '../lib/classes.js';
import Cache from '../lib/class.cache.js';

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

export {
    Collection,
    Cache,
    Category,
    Tag
}