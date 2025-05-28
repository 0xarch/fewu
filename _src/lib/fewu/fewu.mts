import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// support node.js < 20.11.0

let __dirname = dirname(fileURLToPath(import.meta.url));

let package_json_path = join(__dirname,"../../../package.json");

let package_json = JSON.parse((await readFile(package_json_path)).toString());

export const version = package_json.version;

export const url = package_json.repository.url;

// export const url = 'https://github.com/fewu-swg/fewu';