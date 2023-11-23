const Fs = require('fs');
const FsExtra = require('node-fs-extra');
const Path = require('path');

exports.readFile = (...path) =>{
    let file_path = Path.join(...path);
    return Fs.readFileSync(file_path).toString();
}

exports.writeFile = async (content,...path) =>{
    let file_path = Path.join(...path);
    Fs.writeFile(file_path,content,()=>{});
}

exports.copyFile = async (path_from,path_to) =>{
    FsExtra.copy(path_from,path_to,()=>{});
}

exports.mkdir = async (...path) =>{
    FsExtra.mkdirpSync(Path.join(...path));
}

function readDirectoryRecursive(Directory) {
    let returns = [];
    for (let item of Fs.readdirSync(Directory)) {
        let path = Path.join(Directory, item);
        let stat = Fs.statSync(path);
        if (stat.isDirectory()) returns.push(...readDirectoryRecursive(path));
        else returns.push(path);
    }
    return returns;
}

exports.traverse = (directory) => readDirectoryRecursive(directory);