import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";

export default async function App(){
    let v2_conf_path = join(process.cwd(),'config.json');
    let v3_conf_path = join(process.cwd(),'config.yaml');
    let target: Function;
    if(existsSync(v3_conf_path)){
        target = (await import('#lib/fewu/app')).default;
    } else if(existsSync(v2_conf_path)){
        let content = (await readFile(v2_conf_path)).toString();
        let config: any;
        try {
            config = JSON.parse(content);
        } catch(error) {
            throw new Error(`config.json detected, and it's not valid JSON file.`);
        }
        if(config['V3'] || config['EXPERIMENTAL-V3']){
            target = (await import('#lib/fewu/app')).default;
        } else {
            target = (await import("./app.mjs")).default;
        }
    } else {
        target = (await import('#lib/fewu/app')).default;
    }
    await target();
}