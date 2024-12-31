class DataSection {
    $mutable: boolean;
    $done: Promise<any>;

    constructor({mutable=false}={},promise: Promise<any>){
        this.$mutable = mutable;
        this.$done = promise;
    }
}

export {
    DataSection as AbstractSection,
    DataSection
};