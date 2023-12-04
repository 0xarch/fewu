const EJS = require('../parser/ejs/app');
const GHTML = require('../parser/ghtml/app');
const Hail = require('../lib/hail');


exports.build = async function(type,template,json,path,ThemeConfig){
    switch(type){
        case 'EJS':
            Hail.writeFile(EJS.parse(template,json),path);
            break;
        case 'G-EJS':
            Hail.writeFile(GHTML.parse(EJS.parse(template,json),ThemeConfig['EJSX']),path);
            break;
    }
}