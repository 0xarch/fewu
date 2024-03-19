class License{
    #CreativeCommons = {
        BY : false,
        NC : false,
        ND : false,
        SA : false,
        CC0: false,
    }
    #isCreativeCommons = true;
    /**
     * 
     * @param {string} str 
     */
    constructor(str){
        str = str.toLowerCase();
        if(str.includes('private')) this.#isCreativeCommons = false;
        else {
            for(let k in this.#CreativeCommons){
                if(str.includes(k.toLowerCase()) || str.includes(k))
                    this.#CreativeCommons[k]=true;
            }
        }
    }
    description(){
        if(this.#CreativeCommons.CC0) return 'CC0';
        let result='CC';
        if(this.#isCreativeCommons){
            for(let key in this.#CreativeCommons)
                if(this.#CreativeCommons[key])
                    result += '-'+key;
        } else {
            result = 'Private';
        }
        return result;
    }
    /**
     * 
     * @param {'BY'|'NC'|'SA'|'ND'|'CC0'} k 
     * @returns 
     */
    includes(k){
        return this.#CreativeCommons[k];
    }
    is_cc_license(){
        return this.#isCreativeCommons;
    }
}

class Datz {
    y=1970;m=1;d=1;
    /**
     * 
     * @param {number} y 
     * @param {number} m 
     * @param {number} d 
     */
    constructor(y,m,d){
        this.y = y;
        this.m = m;
        this.d = d;
    }
    compareWith(datz){
        if(datz.y>this.y)return 1;
        if(datz.y<this.y)return -1;
        if(datz.m>this.m)return 1;
        if(datz.m<this.m)return -1;
        if(datz.d>this.d)return 1;
        return 0;
    }
    isEarlierThan(datz){
        return this.compareWith(datz)==-1;
    }
    isLaterThan(datz){
        return !this.compareWith(datz)==1;
    }
    toPathString(){
        return this.y+'/'+this.m+'/'+this.d;
    }
    toString(){
        return this.y+'-'+this.m+'-'+this.d;
    }
}

class BuiltinDescriptivePostContainer {
    #sort_name
    included = []
    constructor(name,v){
        this.#sort_name = name;
        this.included.push(v);
    }
    name=()=>this.#sort_name
    includes=(id)=>this.included.includes(id)
    add=(id)=>!this.includes(id)&&this.included.push(id);
}

class Tag extends BuiltinDescriptivePostContainer{
    tagname;
    constructor(name,v){
        super(name,v);
        this.tagname = name;
    }
}

class Category extends BuiltinDescriptivePostContainer{
    catename;
    constructor(name,v){
        super(name,v);
        this.catename = name;
    }
}

export {
    License,
    Datz,
    Tag,
    Category
}