import { join } from "path";
import { readdir, readFile } from "fs/promises";
import { existsSync, lstatSync } from "fs";

declare type DeclaredDependencies = {
    dependencies: Record<string, string>,
    devDependencies: Record<string, string>
}

declare type TraverseOptions = {
    ignoreLink: boolean
}

export default class NodeModules {
    static async traverseModuleDirectory(modules_dir: string, options: TraverseOptions = {
        ignoreLink: true
    }): Promise<string[]> {
        let first_traverse_result = await readdir(modules_dir);

        let all_results: string[] = [], scoped_results: string[] = [];

        first_traverse_result.forEach(result => {
            if (result.startsWith('.')) {
                return;
            }
            if (result.startsWith('@')) {
                scoped_results.push(join(modules_dir, result));
            } else {
                all_results.push(join(modules_dir, result));
            }
        });

        if(options.ignoreLink) {
            all_results = all_results.filter(v => {
                let fstat = lstatSync(v);
                if(fstat.isSymbolicLink()){
                    return false;
                }
                return true;
            });
        }

        await Promise.all(scoped_results.map(async scoped_result => {
            let scoped_modules = await NodeModules.traverseModuleDirectory(scoped_result);
            // scoped_modules = scoped_modules.map(v => join(scoped_result, v));
            all_results.push(...scoped_modules);
        }));

        await Promise.all(all_results.map(async result => {
            let result_submodule_dir = join(result, "node_modules");
            if (existsSync(result_submodule_dir)) {
                let submodules = await NodeModules.traverseModuleDirectory(result_submodule_dir);
                submodules = submodules.map(v => join(result_submodule_dir, v));
                all_results.push(...submodules);
            }
        }));

        return all_results;
    }

    static async getAllModules() {
        let node_modules_dir = join(process.cwd(), 'node_modules');
        if(!existsSync(join(node_modules_dir,".pnpm"))) {
            // classic npm
            let all_results = await this.traverseModuleDirectory(node_modules_dir);
    
            return all_results;
        } else {
            // pnpm
            return this.getPnpmModules();
        }

    }

    static async getPnpmModules() {
        let node_modules_dir = join(process.cwd(), 'node_modules/.pnpm');

        let pnpm_tops = await readdir(node_modules_dir);

        pnpm_tops = pnpm_tops.filter(v => v != 'lock.yaml' && v != 'node_modules');

        pnpm_tops = pnpm_tops.map(v => join(node_modules_dir, v, "node_modules"));

        let all_results = (await Promise.all(pnpm_tops.map(async v => NodeModules.traverseModuleDirectory(v)))).flat(1);

        return all_results;
    }

    static #declaredDependencies?: DeclaredDependencies;

    static async getDeclaredDependencies(): Promise<DeclaredDependencies> {
        if (this.#declaredDependencies) {
            return this.#declaredDependencies;
        }
        const package_json_path = join(process.cwd(), 'package.json');
        if (!existsSync(package_json_path)) {
            return {
                dependencies: {},
                devDependencies: {}
            };
        }
        const package_json_content = (await readFile(package_json_path)).toString();
        const package_json: { dependencies: Record<string, string>, devDependencies: Record<string, string> } = JSON.parse(package_json_content);
        const { dependencies, devDependencies } = package_json;
        return {
            dependencies,
            devDependencies
        }
    }
}