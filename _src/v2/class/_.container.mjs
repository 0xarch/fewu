class _PostContainer {
    by;
    label;
    included = [];
    /**
     * 
     * @param {string} by 
     * @param {string} label 
     * @param {number[]} posts
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
    sort(postIdMap){
        this.included.sort((a,b)=>{
            let Ra = postIdMap.get(a);
            let Rb = postIdMap.get(b);
            return Ra.fuzzyDate.compareWith(Rb.fuzzyDate)
        });
    }
}

export default _PostContainer;
