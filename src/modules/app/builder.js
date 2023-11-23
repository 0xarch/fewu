const EJS = require('../parser/ejs');
const Hail = require('../lib/hail');

exports.build = async function(type,template,json,path){
    if(type == 'EJS'){
        Hail.writeFile(EJS.parse(template,json),path);
    }
}