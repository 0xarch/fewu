import * as EJS from '../parser/ejs/app.js';
import * as RJS from '../parser/rjs/main.js';
import * as PUG from '../parser/pug/app.js';
import * as Hail from '../lib/hail.js';

/**
 * 
 * @param {string} type 
 * @param {string} template 
 * @param {object} json 
 * @param {string} path 
 * @param {object} ThemeConfig 
 * @deprecated
 */
const build = async function(type,template,json,path,ThemeConfig){
    switch(type){
        case 'EJS':
            Hail.writeFile(EJS.parse(template,json),path);
            break;
        case 'RJS':
            Hail.writeFile(RJS.parse(template,json,ThemeConfig['RJS']),path);
            break;
    }
}

/**
 * 
 * @param { string } type 
 * @param { string } template 
 * @param { {
 *  basedir: string,
 *  filename: string
 * } } options 
 * @param { object } provide_variables
 * @param { object } theme_config 
 * @param { string } path_write_to 
 * @returns void
 */
async function build_and_write(type,template,options,provide_variables,theme_config,path_write_to){
    switch(type){
        case 'EJS':
            Hail.writeFile(EJS.parse(template,{options,provide_variables,theme_config}),path_write_to);
        case 'PUG':
        case 'JADE':
            Hail.writeFile(PUG.parse(template,options,provide_variables,theme_config),path_write_to);
            break;
    }
}

export {
    build,
    build_and_write
}