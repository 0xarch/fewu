import _PostContainer from "./_.container.mjs";

class ContainerCategory extends _PostContainer {
    catename;
    /**
     * 
     * @param {string} label 
     * @param {number[]} posts 
     */
    constructor(label,posts){
        super('category',label,posts);
        this.catename = label;
    }
} 

export default ContainerCategory;