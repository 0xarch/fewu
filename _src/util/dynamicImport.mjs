import { info } from "#core/run";
import { existsSync, readFileSync } from "fs";
import { join } from 'path';

async function dynamicImport(id){
    let path = id;
    let result = null;
    try {
        result = await import(path);
    } catch (e) {
        try {
            path = join(process.cwd(), 'node_modules', id);
            if(existsSync(path)){
                let packageJson = JSON.parse(readFileSync(join(path, 'package.json')));
                result = await import(join(path,packageJson.main));
            }
        } catch (e) {
            info.red(['FAILURE','RED'],['Failed to import'],[id,'YELLOW']);
            return null;
        }
    }
    return result;
}

// Mount
global.dynamicImport = dynamicImport;

export default dynamicImport;