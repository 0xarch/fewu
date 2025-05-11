import { join } from "path";
import { readdir } from "fs/promises";

export default class NodeModules {
    static async getAllModules() {
        let node_modules_dir = join(process.cwd(),'node_modules');
        let init_travesing_result = await readdir(node_modules_dir);
    
        let all_results: string[] = [], scoped_results: string[] = [];
    
        init_travesing_result.forEach(v => {
            if(v.startsWith('.')){
                return;
            }
            if(v.startsWith('@')){
                scoped_results.push(v);
            } else {
                all_results.push(v);
            }
        });
    
        let scoped_query_results = await Promise.allSettled(scoped_results.map(async scope_name => {
            let scoped_modules_dir = join(node_modules_dir,scope_name);
            let scoped_packages = (await readdir(scoped_modules_dir)).filter(v => !v.startsWith('.')).map(a => join(scope_name,a));
            all_results.push(...scoped_packages);
            return scoped_packages;
        }));
    
        return all_results;
    }
}