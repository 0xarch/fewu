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

export default database;
