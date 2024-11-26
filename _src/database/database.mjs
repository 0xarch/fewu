import FeatureSection from "./feature.mjs";
import ProcessSection from "./process.mjs";
import UserSection from "./user.mjs";

class DataStore {
    feature;
    process;
    user;

    /**
     * 
     * @param {any} config 
     * @param {Database} database 
     */
    constructor(config, database) {
        // section: feature
        this.feature = new FeatureSection(config);
        // section: process
        this.process = new ProcessSection(config);
        // section: user
        this.user = new UserSection(config);
        this.#init(database);
    }

    /**
     * 
     * @param {Database} database 
     */
    async #init(database) {
        Promise.allSettled([
            this.feature.$done,
            this.process.$done,
            this.user.$done
        ]).then((value)=>{
            database.setInitStatus('done',value);
        });
    }
}

/**
 * Database management.
 * Used to handle operations.
 * To access data, use database.data
 */
class Database {
    data;
    #initPromise;
    #initResolve;
    #initReject; //do we need this?
    #initIsDone = false;
    constructor(config) {
        let dataStore = new DataStore(config, this);
        this.data = new Proxy(dataStore, {
            get: (target, p) => {
                if (!this.#initIsDone) {
                    throw new Error(`[Database] Trying to get data ${p} before initialization is done!`);
                }
                if (!target[p]) {
                    throw new Error(`[Database] No such property ${p} to get in ${target}!`);
                }
                return target[p];
            },
            set: (target, p, newValue) => {
                if (!target[p]) {
                    throw new Error(`[Database] No such property ${p} declared in ${target}!`);
                }
                if (!target[p].$mutable) {
                    throw new Error(`[Database] Property ${p} is immutable!`);
                }
                target[p] = newValue;
            }
        });
        this.#initPromise = new Promise((resolve, reject) => {
            this.#initResolve = resolve;
            this.#initReject = reject;
        }).catch((reason) => {
            console.error(`[Database] Initialization is rejected. Reason: `, ...reason);
            console.error(`Terminating process because database is not initialized correctly.`);
            process.exit(1);
        }).then((message) => {
            console.log(`[Database] Initialization is done. Message: `, ...message);
            this.#initIsDone = true;
        });
    }

    /**
     * 
     * @param {'done'|'fail'} status 
     * @param {...string} message 
     */
    setInitStatus(status, ...message) {
        switch (status) {
            case 'done':
                this.#initResolve(message);
                break;
            case 'fail':
            default:
                this.#initReject(message);
        }
    }

    /**
     * Promise for some tasks that need to do after database is built.
     */
    async initDone() {
        await this.#initPromise;
    }
};

export default Database;

export {
    Database,
    DataStore
}