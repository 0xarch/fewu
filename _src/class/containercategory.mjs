import _PostContainer from "./_.container.mjs";
import Post from "./post.mjs";

class ContainerCategory extends _PostContainer {
    catename;
    /**
     * 
     * @param {string} label 
     * @param {Post[]} posts 
     */
    constructor(label,posts){
        super('category',label,posts);
        this.catename = label;
    }
} 

export default ContainerCategory;