import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";
import { Result } from "#lib/types";

class ExtendedFS {
    static async traverse(directory: string): Promise<Result<string[]>>{
        let files: string[] = [];
        for await (let item of await readdir(directory)){
            const filePath = join(directory, item);
            try {
                const fileStat = await stat(filePath);
                if(fileStat.isDirectory()){
                    let { value, status } = await this.traverse(filePath);
                    if( status === 'Error' ){
                        return {
                            value: null,
                            status
                        }
                    }
                    files.push(... value);
                } else {
                    files.push(filePath);
                }
            } catch (error) {
                return {
                    value: null,
                    status: 'Error'
                }
            }
        }
        return {
            value: files,
            status: 'Ok'
        }
    }
}

export default ExtendedFS;