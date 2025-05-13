import { join } from "path";
import { readdir } from "fs/promises";
import { existsSync } from "fs";

export default class NodeModules {
    static async traverseModuleDirectory(modules_dir: string): Promise<string[]> {
        let first_traverse_result = await readdir(modules_dir);

        let all_results: string[] = [], scoped_results: string[] = [];

        first_traverse_result.forEach(result => {
            if (result.startsWith('.')) {
                return;
            }
            if (result.startsWith('@')) {
                scoped_results.push(join(modules_dir,result));
            } else {
                all_results.push(join(modules_dir,result));
            }
        });

        await Promise.all(scoped_results.map(async scoped_result => {
            let scoped_modules = await NodeModules.traverseModuleDirectory(scoped_result);
            scoped_modules = scoped_modules.map(v => join(scoped_result, v));
            all_results.push(...scoped_modules);
        }));

        await Promise.all(all_results.map(async result => {
            let result_submodule_dir = join(result,"node_modules");
            if(existsSync(result_submodule_dir)){
                let submodules = await NodeModules.traverseModuleDirectory(result_submodule_dir);
                submodules = submodules.map(v => join(result_submodule_dir,v));
                all_results.push(...submodules);
            }
        }));

        return all_results;
    }

    static async getAllModules() {
        let node_modules_dir = join(process.cwd(), 'node_modules');
        
        let all_results = await this.traverseModuleDirectory(node_modules_dir);

        return all_results;
    }
}