import { AbstractSection } from "./abstract.mjs";
import * as os from 'node:os';
import NewPromise from "#util/NewPromise";

class ProcessSection extends AbstractSection {
    arguments;
    buildTime;
    hostPlatform;
    hostType;
    hostVersion;
    nodeVersion;
    constructor(config){
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