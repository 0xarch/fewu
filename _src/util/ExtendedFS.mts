import { existsSync } from "node:fs";
import { stat, readdir, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

declare type ensureOptions = {
    directory: boolean
}

class ExtendedFS {
    static async traverse(directory: string, { includeDirectory = false } = {}): Promise<string[]> {
        let files: string[] = [];
        for await (let item of await readdir(directory)) {
            const filePath = join(directory, item);
            const fileStat = await stat(filePath);
            if (fileStat.isDirectory()) {
                if (includeDirectory) {
                    files.push(filePath);
                }
                let value = await this.traverse(filePath);
                files.push(...value);
            } else {
                files.push(filePath);
            }
        }
        return files
    }

    static async ensure(path: string, options?: ensureOptions): Promise<void> {
        if (!existsSync(path)) {
            if (options?.directory) {
                await mkdir(path, { recursive: true });
            } else {
                await mkdir(dirname(path), { recursive: true });
            }
        }
    }

    static async isDir(path: string): Promise<boolean> {
        if(!existsSync(path)){
            return false;
        }
        let _stat = await stat(path);
        return _stat.isDirectory();
    }
}

export default ExtendedFS;