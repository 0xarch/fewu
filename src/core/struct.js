import GObject from './gobject.js';

class GString {
    static from(str) {
        let strs=[''], i=0, is_in_val = false, is_locating_quote=false, skip_a_char=false, quote_locate_starter='{';
        str.split("").filter(v => v != '').forEach((char)=>{
            if(!skip_a_char){
                if(char=='\\'){
                    skip_a_char = true;
                } else if(is_locating_quote){
                    if(char=='{' || char=='}'){
                        is_in_val = !is_in_val;
                        i++;
                        strs[i]='';
                    } else {
                        strs[i]+=quote_locate_starter+char;
                    }
                    is_locating_quote = false;
                } else if(char=='{' &&! is_in_val){
                    is_locating_quote = true;
                    quote_locate_starter = '{';
                } else if(char=='}' && is_in_val){
                    is_locating_quote = true;
                    quote_locate_starter = '}';
                } else
                strs[i]+=char;
            }else{
                strs[i] += char;
                skip_a_char = false
            }
        });
        return new SymString(strs);
    }

    #str_group;
    constructor(strg) {
        if (Array.isArray(strg)) {
            this.#str_group = strg;
        } else throw new Error('SymString constructor : Argument  not any[]');
    }
    /**
     * 
     * @param {Collection} collection 
     */
    eval(collection){
        if(!collection) return this.toString();
        let is_in_val = false, result='';
        this.#str_group.forEach((v)=>{
            if(is_in_val) result += collection.get(v);
            else result += v;
            is_in_val =! is_in_val;
        });
        return result;
    }
    toString(){
        return this.#str_group.join();
    }
}

class BuiltinCorrespond {
    from = '';
    to = '';
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
}

class Collection {
    #obj;
    /**
     * 
     * @param {object} obj 
     */
    constructor(obj) {
        this.#obj = obj;
    }
    get(key) {
        return GObject.getProperty(this.#obj, key);
    }
    has(key) {
        return GObject.hasProperty(this.#obj, key);
    }
    append(ext) {
        this.#obj = GObject.mix(this.#obj, ext, true);
    }
    asObject() {
        return this.#obj;
    }
    get_all = this.asObject;
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
function NULL_OBJECT() {
    return Object.create(null);
}

export {
    GString,
    Collection,
    Cache,
    Correspond,
    NULL_OBJECT
}