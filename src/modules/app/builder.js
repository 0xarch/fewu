const EJS = require('../parser/ejs/app');
const RJS = require('../parser/rjs/main');
const Hail = require('../lib/hail');


exports.build = async function(type,template,json,path,ThemeConfig){
    switch(type){
        case 'EJS':
            Hail.writeFile(EJS.parse(template,json),path);
            break;
        case 'RJS':
            Hail.writeFile(RJS.parse(template,json,ThemeConfig['RJS']),path);
            break;
    }
}