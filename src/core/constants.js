import db from './database.js';

const CONSTANTS = {
    NEXO_VERSION: "1.0.3 Devel",
    NEXO_VERSION_DEVEL: "n2.2.4-3 Devel",
    NEXO_CODE: "Beta:n:2.2.4-3:AR,NOI",
    NODE_CORE_VERSION: process.versions.node,
    NODE_V8_VERSION: process.versions.v8,
    NODE_CPP_VERSION: process.versions.modules,
    LANG: db.language
}

export default CONSTANTS;