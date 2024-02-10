import * as fs from 'fs';
import pkg from 'node-fs-extra';
const { mkdirp, copy, mkdirpSync } = pkg;
import * as nodepath from 'path';

function readFile(...path){
    let file_path = nodepath.join(...path);
    return fs.readFileSync(file_path).toString();
}

/**
 * 
 * @param { string } content 
 * @param  {...PathLike } path 
 */
async function writeFile(content,...path){
    let file_path = nodepath.join(...path);
    mkdirp(nodepath.dirname(file_path),function(){
        fs.writeFile(file_path,content,()=>{});
    });
}

async function copyFile(path_from,path_to){
    copy(path_from,path_to,()=>{});
}

async function mkdir(...path){
    mkdirpSync(nodepath.join(...path));
}

function isDirectory(path){
    return fs.statSync(path).isDirectory();
}

function dirname(path){
    return nodepath.dirname(path);
}

function readDirectoryRecursive(Directory) {
    let returns = [];
    for (let item of fs.readdirSync(Directory)) {
        let path = nodepath.join(Directory, item);
        let stat = fs.statSync(path);
        if (stat.isDirectory()) returns.push(...readDirectoryRecursive(path));
        else returns.push(path);
    }
    return returns;
}

function traverse(directory) { return readDirectoryRecursive(directory); }

export {
    readFile,
    writeFile,
    copyFile,
    mkdir,
    isDirectory,
    dirname,
    traverse
}