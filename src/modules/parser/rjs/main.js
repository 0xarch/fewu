import { isDirectory, dirname, readFile } from '../../lib/hail.js';
import { __parse } from '../ghtml/app.js';

/**
 * 
 * @param {string} content 
 * @param {object} data 
 * @param {object} config 
 * @returns
 * @deprecated
 */
function parse(content,data,config){
    const resolve_data = data;
    var filedir = data.filename;
    if(!isDirectory(filedir)) filedir = dirname(filedir);
    function include(file_name,include_data){
        var content = readFile(filedir,file_name);
        //content = __parse(content,config);
        return resolveEJS(content,{...resolve_data,...include_data},config);
    }
    resolve_data.include = include;
    let result = resolveEJS(content,resolve_data,config);
    return '<!DOCTYPE html>'+result;
}
/**
 * 
 * @param {string} content 
 * @param {object} options 
 * @param {object} config 
 * @returns string
 * @deprecated
 */
function resolveEJS(content,options,config){
    content = content.replace(/\$\{/g,'\uEBD0');
    content = content.replace(/<%=(.+?)\-?%>/g,function(){
        return '${'+arguments[1]+'}'
    });
    content = content.replace(/<%\-(.+?)\-?%>/g,function(){
        return '${'+arguments[1]+'}'
    });
    content = content.replace(/<%\#(.+?)\-?%>/g,'');
    let head = 'let str = "";\nwith(obj){\nstr += `';
    let body = content = content.replace(/<%(.+?)\-?%>/g,function(){
        return '`\n'+arguments[1]+'\nstr+=`'
    });
    let foot = '`} return str';
    let fn = new Function('obj',head+body+foot);
    let result = fn(options);
    result = result.replace(/\uEBD0/g,'${');
    result = __parse(result,config);
    return result;
}

export { resolveEJS, parse };
