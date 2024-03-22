import db from '#db';
import * as os from 'os';

const CONSTANTS = {
    NEXO_RELEASE_VERSION: "1.0.3",
    NEXO_NEXO_VERSION: "n2.2.5.final",
    NEXO_SYMBOLS: ["AR", "NOI","PACKAGEIMPORT"],
    NODE_CORE_VERSION: process.versions.node,
    NODE_V8_VERSION: process.versions.v8,
    NODE_CPP_VERSION: process.versions.modules,
    OS_PLATFORM: os.platform(),
    OS_RELEASE: os.release(),
    OS_VERSION: os.version(),
    OS_UNAME: os.platform() + os.release() + os.version(),
    LANG: db.language
}

// loop variant
CONSTANTS.CONSTANTS = CONSTANTS;

export default CONSTANTS;