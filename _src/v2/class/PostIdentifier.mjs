import Post from "./post.mjs";

class PostIdentifier {
    type = '';
    identifierName = '';
    /**
     * @type {Post[]}
     */
    includedPosts = [];
    by;
    label;
    included = [];
    /**
     * 
     * @param {string} identifier_type 
     * @param {string} bidentifierName
     * @param {Post[]} posts
     */
    constructor(identifier_type,identifierName,posts){
        this.type = identifier_type;
        this.identifierName = identifierName;
        for(let post of posts){
            if(! post instanceof Post){
                throw new Error (`the given value ${post} is not an instance of Post!`);
            }
            this.includedPosts.push(post);
        }
        this[Symbol.iterator] = function* () {
            yield* this.includedPosts[Symbol.iterator]();
        }
    }
    includes(I){
        return this.includedPosts.includes(I);
    }
    push(I){
        return this.includedPosts.push(I);
    }
    sort(postIdMap){
        this.includedPosts.sort((a,b)=>{
            let Ra = postIdMap.get(a);
            let Rb = postIdMap.get(b);
            return Ra.fuzzyDate.compareWith(Rb.fuzzyDate)
        });
    }
}

class PostCategory extends PostIdentifier {
    /**
     * 
     * @param {string} bidentifier_name
     * @param {Post[]} posts
     */
    constructor(identifier_name,posts){
        super('category',identifier_name,posts);
    }
}

class PostTag extends PostIdentifier {
    /**
     * 
     * @param {string} bidentifier_name
     * @param {Post[]} posts
     */
        constructor(identifier_name,posts){
            super('tag',identifier_name,posts);
        }
}

export default PostIdentifier;

export {
    PostIdentifier,
    PostCategory,
    PostTag
}
