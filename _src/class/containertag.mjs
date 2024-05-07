import _PostContainer from "./_.container.mjs";
import Post from "./post.mjs";

class ContainerTag extends _PostContainer {
    tagname;
    /**
     * 
     * @param {string} label 
     * @param {Post[]} posts 
     */
    constructor(label,posts){
        super('tag',label,posts);
        this.tagname = label;
    }
} 

export default ContainerTag;