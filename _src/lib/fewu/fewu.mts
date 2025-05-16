import { readFile } from "fs/promises";
import { join } from "path";

let package_json_path = join(import.meta.filename,"../../../package.json");

let package_json = JSON.parse((await readFile(package_json_path)).toString());

export const version = package_json.version;

export const url = 'https://github.com/fewu-swg/fewu';
