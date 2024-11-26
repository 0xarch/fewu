class AbstractSection {
    $mutable = false;
    $done;
    /**
     * 
     * @param {{mutable?:boolean}} param0 
     * @param {Promise} promise
     */
    constructor({mutable=false},promise){
        this.$mutable = mutable;
        this.$done = promise;
    }
}

export {
    AbstractSection
};