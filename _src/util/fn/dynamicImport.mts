import { existsSync, readFileSync } from "fs";
import { join } from 'path';
import Console from "#util/Console";

async function dynamicImport(id: string){
    let path = id;
    let result = null;
    try {
        result = await import(path);
    } catch (e) {
        try {
            path = join(process.cwd(), 'node_modules', id);
            if(!existsSync(path)){
                path = id; // absolute import
            }
            if(existsSync(path)){
                let packageJson = JSON.parse(readFileSync(join(path, 'package.json')).toString());
                result = await import('file://'+join(path,packageJson.main));
            }
        } catch (e) {
            Console.error(`[Util/DynamicImport] Failed to import ${id}, returns with null.`);
            return null;
        }
    }
    return result;
}

export default dynamicImport;