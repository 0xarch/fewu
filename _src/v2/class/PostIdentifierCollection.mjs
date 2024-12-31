import PostIdentifier from "./PostIdentifier.mjs";

class PostIdentifierCollection {
    type = '';
    length = 0;
    /**
     * @type {PostIdentifier[]}
     */
    includedIdentifiers = [];

    /**
     * 
     * @param {string} type 
     * @param {PostIdentifier[]} includedIdentifiers 
     */
    constructor(type, includedIdentifiers) {
        this.type = type;
        this.includedIdentifiers = includedIdentifiers;

        this[Symbol.iterator] = function* () {
            yield* this.includedIdentifiers[Symbol.iterator]();
        }
    }
    includes() {

    }

    push() {

    }

    forEach() {

    }

    map() {

    }
}

export default PostIdentifierCollection;