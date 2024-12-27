import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";

class ExtendedFS {
    static async traverse(directory: string, { includeDirectory = false} = {}): Promise<string[]>{
        let files: string[] = [];
        for await (let item of await readdir(directory)){
            const filePath = join(directory, item);
            const fileStat = await stat(filePath);
            if(fileStat.isDirectory()){
                if(includeDirectory) {
                    files.push(filePath);
                }
                let value = await this.traverse(filePath);
                files.push(... value);
            } else {
                files.push(filePath);
            }
        }
        return files
    }
}

export default ExtendedFS;