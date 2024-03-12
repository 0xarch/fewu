import db from './database.js';

const CONSTANTS = {
    NEXO_VERSION: "1.0.2",
    NEXO_CODE: "Beta:2.2.4-2:AR,NOI",
    NODE_CORE_VERSION: process.versions.node,
    NODE_V8_VERSION: process.versions.v8,
    NODE_CPP_VERSION: process.versions.modules,
    LANG: db.language
}

export default CONSTANTS;