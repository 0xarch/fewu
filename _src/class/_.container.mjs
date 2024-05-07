import Post from "./post.mjs";

class _PostContainer {
    by;
    label;
    included = [];
    /**
     * 
     * @param {string} by 
     * @param {string} label 
     * @param {Post[]} posts 
     */
    constructor(by,label,posts){
        this.by = by;
        this.label = label;
        this.included.push(...posts);
    }
    /**
     * 
     * @deprecated directly use CLASS.label
     * @returns {string}
     */
    name(){
        return this.label;
    }
    includes(I){
        return this.included.includes(I);
    }
    add(I){
        this.included.push(I);
    }
}

export default _PostContainer;