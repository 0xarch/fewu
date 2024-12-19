import NewPromise from "#util/NewPromise";

let { promise: DATABASE_INIT_DONE, resolve: DATABASE_INIT_RESOLVE } = NewPromise.withResolvers();

globalThis.DATABASE_INIT_DONE = DATABASE_INIT_DONE;

// we must mount DATABASE_INIT_DONE on globalThis before importing other components, as there may be errors

import Database from "./database.mjs";
import Argv from "#util/Argv";
import { readFileSync, existsSync } from "fs";

let configJsonLocation = Argv.main[0] ?? Argv['--config']?.[0] ?? Argv['-c']?.[0] ?? `config.json`;

if(!existsSync(configJsonLocation)){
    console.error(`No such configuration file: ${configJsonLocation}`);
    process.exit(1);
}

let config = readFileSync(configJsonLocation).toString();

try {
    config = JSON.parse(config);
} catch(e) {
    console.error(`Error while parsing configuration file ${configJsonLocation} : `,e);
    process.exit(1);
}

const database = new Database(config);

database.initDone().then(DATABASE_INIT_RESOLVE);

globalThis.database = database;

export default database;