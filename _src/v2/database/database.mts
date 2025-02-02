import BuilderSection from "./builder.mjs";
import ConstantSection from "./constants.mjs";
import DefaultSection from "./default.mjs";
import DirectorySection from "./directory.mjs";
import FeatureSection from "./feature.mjs";
import GeneralSection from "./general.mjs";
import ModuleSection from "./module.mjs";
import ProcessSection from "./process.mjs";
import ThemeSection from "./theme.mjs";
import UserSection from "./user.mjs";

class DataStore {
    builder;
    constant;
    directory;
    default;
    feature;
    general;
    module;
    process;
    theme;
    user;

    /**
     * 
     * @param {any} config 
     * @param {Database} database 
     */
    constructor(config: any, database: Database) {
        this.builder = new BuilderSection();
        // section: constant
        this.constant = new ConstantSection();
        // section: default
        this.default = new DefaultSection(config);
        // section: directory
        this.directory = new DirectorySection(config);
        // section: feature
        this.feature = new FeatureSection(config);
        // section: general
        this.general = new GeneralSection(config);
        // section: module
        this.module = new ModuleSection(config);
        // section: process
        this.process = new ProcessSection(config);
        // section: theme
        this.theme = new ThemeSection(config);
        // section: user
        this.user = new UserSection(config);
        this.#init(database);
    }

    /**
     * 
     * @param {Database} database 
     */
    async #init(database: Database) {
        Promise.allSettled([
            this.builder.$done,
            this.constant.$done,
            this.default.$done,
            this.directory.$done,
            this.feature.$done,
            this.general.$done,
            this.module.$done,
            this.process.$done,
            this.theme.$done,
            this.user.$done
        ]).then((value)=>{
            value.forEach(v=>{
                if(v.status === "rejected"){
                    database.setInitStatus("fail",v);
                    return;
                }
            });
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
    data: DataStore;
    #initPromise;
    #initResolve?: (...args: any[]) => void;
    #initReject?: (...args: any[]) => void; //do we need this?
    #initIsDone = false;
    constructor(config: any) {
        let dataStore = new DataStore(config, this);
        this.data = new Proxy(dataStore, {
        });
        this.#initPromise = new Promise<any>((resolve, reject) => {
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

    setInitStatus(status: 'done' | 'fail', ...message: any[]) {
        switch (status) {
            case 'done':
                this.#initResolve?.(message);
                break;
            case 'fail':
            default:
                this.#initReject?.(message);
        }
    }

    /**
     * Promise for some tasks that need to do after database is built.
     */
    async initDone() {
        return this.#initPromise;
    }
};

export default Database;

export {
    Database,
    DataStore
}