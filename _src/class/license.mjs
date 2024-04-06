class License {
    /**
     * @type {'REPRINT'|'PRIVATE'|'CC'|'CCZERO'}
     */
    type= 'PRIVATE'
    #cc_type = {
        ZERO: false,
        BY: false,
        NC: false,
        ND: false,
        SA: false,
    };
    /**
     * 
     * @param {string} str 
     */
    constructor(str) {
        str = str.toLowerCase()
        if (str.includes('private')) this.type = 'PRIVATE'
        else if (str.includes('reprint')) this.type = 'REPRINT'
        else if (str.includes('cc0') || str.includes('cc-zero')) this.type = 'CCZERO'
        else {
            for (let k in this.#cc_type) {
                if (str.includes(k.toLowerCase()) || str.includes(k))
                    this.#cc_type[k] = true
            }
        }
    }
    description() {
        switch(this.type){
            case 'CC':
                let result = 'CC'
                for(let key in this.#cc_type)
                    if(this.#cc_type[key])
                        result += '-'+key
                return result
            case 'PRIVATE':
                return 'PRIVATE'
            case 'REPRINT':
                return 'REPRINT'
            case 'CCZERO':
                return 'CCZERO'
        }
    }
    /**
     * 
     * @param {'BY'|'NC'|'SA'|'ND'|'ZERO'} k 
     * @returns {boolean}
     */
    includes(k) {
        return this.#cc_type[k]
    }
    /**
     * @returns {boolean}
     */
    isCreativeCommons() {
        return this.type == 'CC' || this.type == 'CCZERO'
    }
    /**
     * @deprecated use isCreativeCommons instead
     */
    is_cc_license(){
        return this.isCreativeCommons();
    }
}

export default License;