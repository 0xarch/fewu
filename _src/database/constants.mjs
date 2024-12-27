import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";
import Argv from "#util/Argv";
import * as os from "node:os";

class ConstantSection extends AbstractSection {
    fewu = {
        RELEASE_VERSION: "2.1.0",
        DEBUG_ENABLED: Argv['--debug'] || Argv['-D'] || false
    };
    node = {
        CORE_VERSION: process.versions.node,
        V8_VERSION: process.versions.v8,
        BUILTIN_VERSION: process.versions.modules
    }
    os = {
        PLATFORM: os.platform(),
        RELEASE: os.release(),
        KERNEL_VERSION: os.version(),
    }

    constructor(){
        let {promise,resolve} = NewPromise.withResolvers();
        super({},promise);
        resolve('constant');
    }
}

export default ConstantSection;