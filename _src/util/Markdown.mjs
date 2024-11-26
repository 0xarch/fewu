import { Marked } from "marked";

class Markdown {
    #marked;
    #usedExtensions = [];
    /**
     * @type {import("marked").MarkedOptions}
     */
    #parseOptions = {
        mangle: false,
        noHeaderIds: false
    };

    /**
     * 
     * @param {...import("marked").MarkedExtension} extensions 
     */
    constructor(...extensions){
        this.#marked = new Marked(...extensions);
        this.#usedExtensions.push(...extensions);
    }

    /**
     * 
     * @param {string} src 
     * @returns {string}
     */
    parse(src){
        return this.#marked.parse(src,this.#parseOptions);
    }

    /**
     * 
     * @param  {...import("marked").MarkedExtension} extensions 
     */
    use(...extensions){
        this.#marked.use(...extensions);
        this.#usedExtensions.push(...extensions);
    }

    /**
     * 
     * @param {keyof import("marked").MarkedOptions} key 
     * @param {import("marked").MarkedOptions[key]} value 
     */
    setOption(key,value){
        this.#parseOptions[key] = value;
    }

    getUsedExtensions(){
        return this.#usedExtensions;
    }

    getOptions(){
        return this.#parseOptions;
    }
}

export default Markdown;