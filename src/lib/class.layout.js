import { Correspond } from "../core/struct.js";

class Layout {
    #correspond;
    #name;
    #isCycling;
    #isVarias;
    #hasAddition;
    #option;
    #addition;
    constructor(json) {
        this.#correspond = Correspond(json.from || json.build.filename, json.to || json.build.destname);
        this.#name = json.name || 'NONAME';
        this.#isVarias = json.varias || (json.build && json.build.varias) ? true : false;
        this.#isCycling = json.cycling || (json.build && json.build.cycling) ? true : false;
        this.#hasAddition = json.addition ? true : false;
        this.#hasAddition && (this.#addition = json.addition);
        this.#option = json.option || (json.build && json.build.option) || {};
    }
    correspond() {
        return this.#correspond;
    }
    name() {
        return this.#name;
    }
    is_cycling() {
        return this.#isCycling;
    }
    is_varias() {
        return this.#isVarias;
    }
    has_addition() {
        return this.#hasAddition;
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