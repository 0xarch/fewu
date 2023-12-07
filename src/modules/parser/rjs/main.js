const Hail = require('../../lib/hail');
const G = require('../ghtml/app');

exports.parse = function(content,data,config){
    const resolve_data = data;
    var filedir = data.filename;
    if(!Hail.isDirectory(filedir)) filedir = Hail.dirname(filedir);
    function include(file_name,include_data){
        var content = Hail.readFile(filedir,file_name);
        content = G.parse(content,config);
        return resolveEJS(content,{...resolve_data,...include_data},config);
    }
    resolve_data.include = include;
    let result = resolveEJS(content,resolve_data,config);
    return '<!DOCTYPE html>'+result;
}
function resolveEJS(content,options,config){
    content = G.parse(content,config);
    content = content.replace(/<%=(.+?)\-?%>/g,function(){
        return '${'+arguments[1]+'}'
    });
    content = content.replace(/<%\-(.+?)\-?%>/g,function(){
        return '${'+arguments[1]+'}'
    });
    let head = 'let str = "";\nwith(obj){\nstr += `';
    let body = content = content.replace(/<%(.+?)\-?%>/g,function(){
        return '`\n'+arguments[1]+'\nstr+=`'
    });
    let foot = '`} return str';
    let fn = new Function('obj',head+body+foot);
    return fn(options);
}

exports.resolveEJS = resolveEJS;
