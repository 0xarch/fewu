import { Correspond } from "#core/struct";

class Layout {
    #correspond;
    #name;
    #use_split_build;
    #use_foreach_build;
    #has_addition;
    #option;
    #addition;
    constructor(json) {
        this.#correspond = Correspond(json.from ?? json.build.filename, json.to ?? json.build.destname);
        this.#name = json.name ?? 'NONAME';
        this.#use_foreach_build = !!(json.varias ?? json.use_foreach);
        this.#use_split_build = !!(json.cycling ?? json.use_split);
        this.#has_addition = !!json.addition;
        this.#has_addition && (this.#addition = json.addition);
        this.#option = json.option ?? {};
    }
    correspond() {
        return this.#correspond;
    }
    name() {
        return this.#name;
    }
    /**
     * @deprecated use useSplitBuild instead
     * @returns {boolean}
     */
    is_cycling() {
        return this.#use_split_build;
    }
    /**
     * @deprecated use useForeachBuild instead
     * @returns {boolean}
     */
    is_varias() {
        return this.#use_foreach_build;
    }
    /**
     * @deprecated use hasAddition instead
     * @returns {boolean}
     */
    has_addition() {
        return this.#has_addition;
    }
    hasAddition(){
        if(!this.#addition) return false;
        return this.#has_addition;
    }
    useSplitBuild(){
        if(!(this.#option['@split'] ?? this.#option.cycling)) return false;
        return this.#use_split_build;
    }
    useForeachBuild(){
        if(!(this.#option['@foreach'] ?? this.#option.varias)) return false;
        return this.#use_foreach_build;
    }
    getSplitOptions(){
        return this.#option['@split'] ?? this.#option.cycling;
    }
    getForeachOptions(){
        return this.#option['@foreach'] ?? this.#option.cycling;
    }
    addition() {
        return this.#addition;
    }
    option() {
        return this.#option;
    }
    toString() {
        return `--- ${this.#name} ---\n${this.#correspond.from} -> ${this.#correspond.to}\n${JSON.stringify(this.#option)}\n---------\n`;
    }
}

export default Layout;