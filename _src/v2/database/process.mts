import * as os from 'node:os';
import NewPromise from "#util/NewPromise";
import { DataSection } from "./database.mjs";

class ProcessSection extends DataSection {
    arguments;
    buildTime;
    hostPlatform;
    hostType;
    hostVersion;
    nodeVersion;
    constructor(config: any){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.arguments = process.argv;
        this.buildTime = new Date();
        this.hostPlatform = os.platform();
        this.hostType = os.type();
        this.hostVersion = os.version();
        this.nodeVersion = process.version;

        resolve('process');
    }
}

export default ProcessSection;