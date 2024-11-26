class NewPromise {
    static withResolvers(){
        /**
         * @type {(value: any) => void}
         */
        let resolve;
        /**
         * @type {(value: any) => void}
         */
        let reject;
        let promise = new Promise((_resolve,_reject)=>{
            resolve = _resolve;
            reject = _reject;
        }) ;
        return {
            promise,
            resolve,
            reject
        }
    }
}

export default NewPromise;