class NewPromise {
    static withResolvers<T>(): { promise: Promise<T>, resolve: (value: T | PromiseLike<T>) => any, reject: (value: T | PromiseLike<T>) => any } {
        let resolve: (value: T | PromiseLike<T>) => any = () => void 0;
        let reject: (value: T | PromiseLike<T>) => any = () => void 0;
        let promise = new Promise<T>((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });
        return {
            promise,
            resolve,
            reject
        }
    }
}

export default NewPromise;