import _PostContainer from "./_.container.mjs";

class ContainerTag extends _PostContainer {
    tagname;
    /**
     * 
     * @param {string} label 
     * @param {number[]} posts 
     */
    constructor(label,posts){
        super('tag',label,posts);
        this.tagname = label;
    }
} 

export default ContainerTag;