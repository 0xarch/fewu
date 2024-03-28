import db from '#db';
import * as os from 'os';

const CONSTANTS = {
    FEWU_RELEASE_VERSION: "1.0.0",
    FEWU_INSIDER_VERSION: "2.4.0",
    FEWU_SYMBOLS: ["AR", "NOI","IMPORT","YBNY","MOV","NPMENA"],
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