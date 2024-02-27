import { get_property } from "./base_fn.js";

class Collection{
    #json;
    constructor(json){
        this.#json = json;
    }
    append(json){
        mix_object(this.#json,json,true);
    }
    get(name){
        return get_property(this.#json,name);
    }
    get_all(){
        return this.#json;
    }
}

export default Collection;