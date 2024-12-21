import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";

class ExtendedFS {
    static async traverse(directory: string): Promise<string[]>{
        let files: string[] = [];
        for await (let item of await readdir(directory)){
            const filePath = join(directory, item);
            const fileStat = await stat(filePath);
            if(fileStat.isDirectory()){
                files.push(... await this.traverse(filePath));
            } else {
                files.push(filePath);
            }
        }
        return files;
    }
}

export default ExtendedFS;