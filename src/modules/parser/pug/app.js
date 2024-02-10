import { compile } from "pug";

function parse(template,options,provide_variables){
    return compile(template,options)(provide_variables);
}

export {
    parse
}