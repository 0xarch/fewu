import db from './database.js';
import * as os from 'os';

const CONSTANTS = {
    NEXO_VERSION: "1.0.3 devel",
    NEXO_VERSION_DEVEL: "n2.2.5-1",
    NEXO_CODE: "Beta:n:2.2.5-1:FED,NOI",
    NODE_CORE_VERSION: process.versions.node,
    NODE_V8_VERSION: process.versions.v8,
    NODE_CPP_VERSION: process.versions.modules,
    OS_PLATFORM: os.platform(),
    OS_RELEASE: os.release(),
    OS_VERSION: os.version(),
    LANG: db.language
}

CONSTANTS.CONSTANTS = CONSTANTS;

export default CONSTANTS;